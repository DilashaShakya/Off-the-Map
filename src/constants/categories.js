import {
  TreePine,
  Coffee,
  Utensils,
  Camera,
  Mountain,
  Landmark,
  Palette,
  ShoppingBag,
} from 'lucide-react'

export const CATEGORIES = [
  { label: 'Nature', icon: TreePine, color: '#5B8C68' },
  { label: 'Cafés', icon: Coffee, color: '#B9784F' },
  { label: 'Food', icon: Utensils, color: '#E0793C' },
  { label: 'Photography', icon: Camera, color: '#4E89AE' },
  { label: 'Views', icon: Mountain, color: '#6C8CBF' },
  { label: 'Museums', icon: Landmark, color: '#8A6FB0' },
  { label: 'Art', icon: Palette, color: '#E8447C' },
  { label: 'Shops', icon: ShoppingBag, color: '#D4A527' },
]

export const CATEGORY_LABELS = CATEGORIES.map((category) => category.label)

export function getCategory(label) {
  return CATEGORIES.find((category) => category.label === label)
}
