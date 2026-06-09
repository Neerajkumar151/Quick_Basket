#!/bin/bash
find src/services -name "*.ts" -print0 | while IFS= read -r -d '' file; do
  sed -i 's/const current = orders\[index\];/const current = orders[index] as Order;/g' "$file"
  sed -i 's/const current = getStoredOrders()\[index\];/const current = getStoredOrders()[index] as Order;/g' "$file"
  sed -i 's/categories\[index\] = { \.\.\.categories\[index\]/categories[index] = { ...(categories[index] as Category)/g' "$file"
  sed -i 's/categories\[index\]\.status/((categories[index] as Category).status)/g' "$file"
  sed -i 's/return categories\[index\]/return categories[index] as Category/g' "$file"
  
  sed -i 's/tags\[index\] = { \.\.\.tags\[index\]/tags[index] = { ...(tags[index] as Tag)/g' "$file"
  sed -i 's/tags\[index\]\.status/((tags[index] as Tag).status)/g' "$file"
  sed -i 's/return tags\[index\]/return tags[index] as Tag/g' "$file"

  sed -i 's/subCategories\[index\] = updatedSubCategory/subCategories[index] = updatedSubCategory as SubCategory/g' "$file"
  sed -i 's/return updatedSubCategory/return updatedSubCategory as SubCategory/g' "$file"
  sed -i 's/subCategories\[index\]\.status/((subCategories[index] as SubCategory).status)/g' "$file"

  sed -i 's/products\[index\] = updatedProduct/products[index] = updatedProduct as Product/g' "$file"
  sed -i 's/return updatedProduct/return updatedProduct as Product/g' "$file"
done
