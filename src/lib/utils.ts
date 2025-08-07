import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format price to Vietnamese currency (Định dạng giá tiền theo tiền tệ Việt Nam)
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// Format number with thousand separators (Định dạng số với dấu phân cách hàng nghìn)
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num)
}
