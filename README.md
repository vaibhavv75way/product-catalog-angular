# Product Catalog Angular

A modern e-commerce product catalog application built with Angular 21, featuring state management with NgRx, Angular Material UI components, and a fully functional shopping cart system.

## 🎥 Watch Demo Video

[[Product Catalog Demo]](https://drive.google.com/file/d/1dZQnkF4GnIUN9ea50hmO2O6YRwiDw85d/view?usp=sharing)


## ✨ Features

- 🛍️ **Product Catalog**: Browse through a collection of products with detailed information
- 🛒 **Shopping Cart**: Add, remove, and update product quantities in cart
- 💾 **State Management**: Powered by NgRx for predictable state management
- 🎨 **Material Design**: Built with Angular Material components
- 🔄 **Lazy Loading**: Route-based lazy loading for optimal performance
- 💡 **Modern Angular**: Uses standalone components and latest Angular features
- 🎯 **Signals**: Leverages Angular signals for reactive programming
- 📱 **Responsive Design**: Works seamlessly across different screen sizes
- 💾 **Local Storage**: Cart state persists using localStorage via NgRx Effects

## 🚀 Tech Stack

- **Angular**: v21.1.0
- **NgRx Store**: v21.0.1 - State management
- **NgRx Effects**: v21.0.1 - Side effects handling
- **NgRx DevTools**: v21.0.1 - Redux DevTools integration
- **Angular Material**: v21.1.2 - UI components
- **RxJS**: v7.8.0 - Reactive programming
- **Tailwind CSS**: v4.1.12 - Utility-first CSS
- **Vitest**: Testing framework

## 📁 Project Structure

```
src/
├── app/
│   ├── layout/
│   │   └── header/          # Header component with cart badge
│   ├── models/              # TypeScript interfaces and types
│   │   ├── cart.model.ts
│   │   └── product.model.ts
│   ├── pages/               # Route components (lazy loaded)
│   │   ├── home/
│   │   ├── products/
│   │   ├── single-product/
│   │   └── cart/
│   ├── services/            # Business logic services
│   │   ├── cart.service.ts
│   │   └── product.services.ts
│   └── store/               # NgRx state management
│       ├── cart.actions.ts
│       ├── cart.effects.ts
│       ├── cart.reducer.ts
│       └── cart.selectors.ts
```

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd product-catalog-angular
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## 🏃 Development Server

To start a local development server, run:

```bash
npm start
# or
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## 🔨 Building

To build the project for production:

```bash
npm run build
# or
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. The production build is optimized for performance and speed.

## 🧪 Running Tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner:

```bash
npm test
# or
ng test
```

## 📦 Key Features Implementation

### NgRx State Management
The application uses NgRx for managing cart state with:
- **Actions**: Define cart operations (add, remove, update, clear)
- **Reducers**: Handle state updates immutably
- **Selectors**: Efficiently select state slices
- **Effects**: Handle localStorage persistence

### Lazy Loading
All route components are lazy-loaded for optimal performance:
- Home page
- Products catalog
- Single product details
- Shopping cart

### Cart Features
- Add products to cart with quantity
- Update product quantities
- Remove items from cart
- View cart total
- Persistent cart using localStorage
- Real-time cart item count in header

## 🎨 Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component:

```bash
ng generate component component-name
```

For a complete list of available schematics:

```bash
ng generate --help
```

## 📚 Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [NgRx Documentation](https://ngrx.io)
- [Angular Material](https://material.angular.io)

## 📝 License

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.2.

---

Made with ❤️ using Angular
