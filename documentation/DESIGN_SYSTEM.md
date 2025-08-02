# ApiGate Design System

## Overview

This document outlines the design system for ApiGate, ensuring consistency across all components and pages.

## 🎨 Color Palette

### Primary Colors
- **Amber**: `#f59e0b` (amber-500)
- **Orange**: `#ea580c` (orange-500)
- **Gradient**: `from-amber-500 to-orange-500`

### Secondary Colors
- **Gray**: `#6b7280` (gray-500)
- **White**: `#ffffff`
- **Background**: `#f9fafb` (gray-50)

### Status Colors
- **Success**: `#10b981` (emerald-500)
- **Error**: `#ef4444` (red-500)
- **Warning**: `#f59e0b` (amber-500)
- **Info**: `#3b82f6` (blue-500)

## 📝 Typography

### Headings
- **H1**: `text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-bold`
- **H2**: `text-2xl sm:text-3xl lg:text-4xl font-bold`
- **H3**: `text-xl sm:text-2xl font-semibold`
- **H4**: `text-lg font-semibold`

### Body Text
- **Large**: `text-lg sm:text-xl`
- **Medium**: `text-base sm:text-lg`
- **Small**: `text-sm sm:text-base`
- **Extra Small**: `text-xs sm:text-sm`

### Gradient Text
```css
bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent
```

## 🎯 Component Patterns

### Buttons

#### Primary Button
```jsx
className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
```

#### Secondary Button
```jsx
className="bg-transparent border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
```

#### Small Button
```jsx
className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base shadow-lg hover:shadow-xl"
```

### Cards

#### Primary Card
```jsx
className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-12"
```

#### Secondary Card
```jsx
className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6"
```

### Forms

#### Input Fields
```jsx
className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base transition-colors"
```

#### Labels
```jsx
className="block text-sm font-medium text-gray-700 mb-2"
```

### Icons

#### Icon Containers
```jsx
className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl flex items-center justify-center"
```

#### Icon Sizes
- **Small**: `w-4 h-4 sm:w-5 sm:h-5`
- **Medium**: `w-6 h-6 sm:w-7 sm:h-7`
- **Large**: `w-8 h-8`

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 640px`
- **Tablet**: `640px - 1024px`
- **Desktop**: `> 1024px`

### Spacing Scale
- **xs**: `0.25rem` (4px)
- **sm**: `0.5rem` (8px)
- **md**: `1rem` (16px)
- **lg**: `1.5rem` (24px)
- **xl**: `2rem` (32px)
- **2xl**: `3rem` (48px)

### Responsive Patterns
```jsx
// Text sizing
className="text-sm sm:text-base lg:text-lg"

// Spacing
className="p-4 sm:p-6 lg:p-8"

// Layout
className="flex-col sm:flex-row"

// Grid
className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
```

## 🎨 Page Layouts

### Landing Page Sections
```jsx
<section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
  <div className="max-w-7xl mx-auto">
    {/* Content */}
  </div>
</section>
```

### Dashboard Layout
```jsx
<div className="min-h-screen bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
    {/* Content */}
  </div>
</div>
```

### Modal/Form Layout
```jsx
<div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-12 max-w-2xl mx-auto">
  {/* Content */}
</div>
```

## 🎯 Interactive Elements

### Hover Effects
```jsx
// Scale effect
className="transform hover:scale-105 transition-all duration-200"

// Shadow effect
className="shadow-lg hover:shadow-xl transition-all duration-200"

// Color transition
className="transition-colors duration-200"
```

### Loading States
```jsx
// Spinner
<svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>
```

## 🎨 Visual Hierarchy

### Section Headers
```jsx
<div className="text-center mb-12 sm:mb-16">
  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
    <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
      Section Title
    </span>
  </h2>
  <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
    Section description
  </p>
</div>
```

### Feature Cards
```jsx
<div className="flex items-center space-x-4">
  <div className="w-12 h-12 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
    <Icon className="w-6 h-6 text-amber-600" />
  </div>
  <div>
    <h3 className="text-lg font-semibold text-gray-900">Feature Title</h3>
    <p className="text-sm text-gray-600">Feature description</p>
  </div>
</div>
```

## 🚀 Best Practices

### 1. Mobile-First Design
- Always start with mobile styles
- Use responsive prefixes (`sm:`, `lg:`, etc.)
- Test on multiple screen sizes

### 2. Consistent Spacing
- Use the spacing scale consistently
- Maintain visual rhythm across components

### 3. Color Consistency
- Use the defined color palette
- Maintain proper contrast ratios
- Use gradients for primary actions

### 4. Typography Hierarchy
- Use consistent heading sizes
- Maintain proper line heights
- Ensure readability across devices

### 5. Interactive Feedback
- Provide hover states for all interactive elements
- Use consistent transition durations
- Include loading states where appropriate

## 📋 Component Checklist

Before implementing any component, ensure:

- [ ] Uses consistent color palette
- [ ] Follows responsive design patterns
- [ ] Includes proper hover states
- [ ] Maintains accessibility standards
- [ ] Uses consistent spacing
- [ ] Follows typography hierarchy
- [ ] Includes loading states where needed
- [ ] Tests on mobile devices

## 🎯 Implementation Guidelines

### For New Components
1. Start with mobile layout
2. Add responsive breakpoints
3. Apply consistent styling
4. Test across devices
5. Document any variations

### For Existing Components
1. Audit against design system
2. Update to match patterns
3. Ensure responsive behavior
4. Test functionality
5. Update documentation

This design system ensures a cohesive, professional, and user-friendly experience across all ApiGate components and pages. 