import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Lock,
  Navigation,
  Map as MapIcon,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import {
  locationDetailsSchema,
  type LocationDetailsFormValues,
} from "../../validations/onboarding";
import { INDIAN_STATES } from "../../constants/locations";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { apiClient } from "../../utils/api-client";
import { ENDPOINTS } from "../../constants/endpoints";

// Fix Leaflet's default marker icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

const DEFAULT_CENTER: [number, number] = [28.6139, 77.209]; // New Delhi

export const LocationForm: React.FC<LocationFormProps> = ({
  onNext,
  onPrevious,
}) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LocationDetailsFormValues>({
    resolver: zodResolver(locationDetailsSchema),
  });

  const reverseGeocode = async (lat: number, lng: number) => {
    setIsFetching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();

      // console.log("📍 Nominatim API Response:", data);

      if (data && data.address) {
        // Use display_name to get everything before the city for a complete street address
        let street = "";
        const parts = (data.display_name || "").split(", ");
        const city =
          data.address.city || data.address.town || data.address.village;

        // Try to find where the city starts in the display name
        const cityIndex = parts.findIndex((p: string) => p.trim() === city);

        if (cityIndex > 0) {
          // Join everything before the city
          street = parts.slice(0, cityIndex).join(", ");
        } else {
          // Fallback: just take the first 2-3 parts
          street = parts
            .slice(0, Math.min(3, Math.max(1, parts.length - 2)))
            .join(", ");
        }

        setValue("streetAddress", street);

        if (data.address.city || data.address.town || data.address.village) {
          setValue(
            "city",
            data.address.city || data.address.town || data.address.village,
          );
        }

        // Match state
        if (data.address.state) {
          const matchedState = INDIAN_STATES.find(
            (s) => s.label.toLowerCase() === data.address.state.toLowerCase(),
          );
          if (matchedState) {
            setValue("state", matchedState.value);
          }
        } else if (data.address["ISO3166-2-lvl4"]) {
          const code = data.address["ISO3166-2-lvl4"].replace("IN-", "");
          const matchedState = INDIAN_STATES.find((s) => s.value === code);
          if (matchedState) {
            setValue("state", matchedState.value);
          }
        }

        if (data.address.postcode) {
          setValue("postalCode", data.address.postcode);
        }

        // Save backend coords
        setValue("latitude", lat);
        setValue("longitude", lng);
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        reverseGeocode(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        console.error(error);
        setIsLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  const onSubmit = async (data: LocationDetailsFormValues) => {
    try {
      await apiClient.patch(ENDPOINTS.ONBOARDING.LOCATION, data);
      onNext();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || t("onboarding.form.error", "Failed to submit. Please try again.");
      toast.error(errorMessage);
    }
  };

  // Map Click Handler Component
  const MapClickHandler = () => {
    const map = useMap();
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);

        // Debounce logic
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
          reverseGeocode(lat, lng);
        }, 300);

        map.flyTo([lat, lng], map.getZoom(), { animate: true, duration: 0.5 });
      },
    });

    useEffect(() => {
      if (position) {
        map.flyTo(position, 16, { animate: true, duration: 1 });
      }
    }, [position, map]);

    return position ? <Marker position={position} /> : null;
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="bg-card border border-border rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-sm flex-1">
        {/* Left Side: Form */}
        <div className="flex-1 p-8 lg:p-10 border-b md:border-b-0 md:border-r border-border relative">
          {/* Overlay when fetching */}
          {isFetching && (
            <div className="absolute inset-0 bg-card/60 backdrop-blur-[1px] z-20 flex items-center justify-center rounded-l-2xl">
              <div className="flex flex-col items-center gap-3 bg-background border border-border p-4 rounded-xl shadow-lg">
                <MapIcon className="animate-bounce text-primary" size={24} />
                <span className="text-description font-medium">
                  {t("onboarding.location.map.fetching")}
                </span>
              </div>
            </div>
          )}

          <h2 className="text-h2 font-bold text-card-foreground mb-2">
            {t("onboarding.location.title")}
          </h2>
          <p className="text-muted-foreground text-description mb-8">
            {t("onboarding.location.subtitle")}
          </p>

          <form
            id="location-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <Input
              label={t("onboarding.location.fields.streetAddress.label")}
              placeholder={
                t("onboarding.location.fields.streetAddress.placeholder")
              }
              prefixElement={
                <MapPin size={16} className="text-muted-foreground" />
              }
              error={errors.streetAddress?.message}
              spellCheck={false}
              disabled={isFetching || isSubmitting}
              required
              {...register("streetAddress")}
            />

            <Input
              label={t("onboarding.location.fields.landmark.label")}
              placeholder={t("onboarding.location.fields.landmark.placeholder")}
              error={errors.landmark?.message}
              spellCheck={false}
              disabled={isFetching || isSubmitting}
              {...register("landmark")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t("onboarding.location.fields.city.label")}
                placeholder={t("onboarding.location.fields.city.placeholder")}
                error={errors.city?.message}
                spellCheck={false}
                disabled={isFetching || isSubmitting}
                required
                {...register("city")}
              />
              <Select
                label={t("onboarding.location.fields.state.label")}
                error={errors.state?.message}
                disabled={isFetching || isSubmitting}
                required
                {...register("state")}
                value={watch("state")}
              >
                <option value="">
                  {t("onboarding.location.fields.state.placeholder")}
                </option>
                {INDIAN_STATES.map((state: {value: string, label: string}) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t("onboarding.location.fields.postalCode.label")}
                placeholder={
                  t("onboarding.location.fields.postalCode.placeholder")
                }
                error={errors.postalCode?.message}
                spellCheck={false}
                disabled={isFetching || isSubmitting}
                required
                {...register("postalCode")}
              />
              <Input
                label={t("onboarding.location.fields.country.label")}
                value={t("onboarding.location.fields.country.value")}
                readOnly
                className="text-muted-foreground bg-muted/30"
                suffixElement={
                  <Lock
                    size={16}
                    className="text-muted-foreground opacity-50"
                  />
                }
              />
            </div>

            {/* Hidden fields for lat/lng to submit with form */}
            <input
              type="hidden"
              {...register("latitude", { valueAsNumber: true })}
            />
            <input
              type="hidden"
              {...register("longitude", { valueAsNumber: true })}
            />
          </form>
        </div>

        {/* Right Side: Map UI */}
        <div className="flex-1 bg-background/50 relative min-h-[400px]">
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={5}
            className="w-full h-full absolute inset-0 z-0"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler />
          </MapContainer>

          {/* Controls overlay */}
          <div className="absolute top-4 left-4 z-10">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLocating}
              className="flex items-center gap-2 bg-card border border-border px-3 py-2 rounded-md text-description font-medium text-foreground shadow-md hover:bg-muted transition-colors disabled:opacity-50"
            >
              <Navigation size={16} className="text-primary" />
              {isLocating ? "Locating..." : t("onboarding.location.map.pin")}
            </button>
          </div>

          {/* Status overlay */}
          {position && !isFetching && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-full text-caption font-medium text-foreground shadow-md transition-opacity">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              {t("onboarding.location.map.status")}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-border mt-auto gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onPrevious}
          disabled={isSubmitting || isFetching}
        >
          <ArrowLeft size={16} className="mr-2" />
          {t("onboarding.location.buttons.previous")}
        </Button>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="text-description text-auth-text/80">
            {t("onboarding.form.hasAccount")}{" "}
            <Link to="/login" className="text-auth-text hover:underline font-bold">
              {t("onboarding.form.signIn")}
            </Link>
          </div>
          <Button
            type="submit"
            form="location-form"
            disabled={isSubmitting || isFetching}
            className="min-w-[140px] w-full sm:w-auto"
          >
            {isSubmitting
              ? t("onboarding.form.submitting")
              : t("onboarding.location.buttons.continue")}
            {!isSubmitting && <ArrowRight size={16} className="ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
