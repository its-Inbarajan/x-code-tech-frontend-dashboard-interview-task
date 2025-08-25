## Product Dashboard - Next.js App Router 

A full-stack dashboard built with **Next.js** App Router that displays a list of products with filtering, sorting, pagination, and CRUD operations.
Includes a simple backend API using Next.js API routes with MongoDB (or mock data fallback).

**Live Demo** [LINK](https://inbarajan-interview-task.vercel.app/)

**Features**

✅ Products table with columns: **Name**, **Price**, **Stock**, **Category**, **Status**, **Vendor**
✅ Pagination (server-side)
✅ Sorting by Price, Stock, Created At (desc default)
✅ Filtering by Category & Status
✅ Search by name or vendor
✅ View toggle: **Grid view** / **Table view**
✅ CRUD: Create, Update, Delete products
✅ Responsive design (mobile-friendly)
✅ API with **Next.js App Router**
✅ Bonus: Debounced search, Suspense boundaries, optimistic UI updates

**Tech Stack**

Next.js 14 (App Router)

  - TypeScript

  - MongoDB (optional) or in-memory mock data

  - Tailwind CSS for styling

  - React Context for state management

  - React Toastify for notifications

**Running with Mock Data**

If MongoDB is not connected, API will return data from mockProducts in memory.

**Deployment on Vercel**

1) Push to GitHub.
2) Connect repository to Vercel.
3) Add .env.local variables in Vercel Project Settings.
4) Deploy.

**How to Use**

1) Use Filters to search by category/status.
2) Use Tabs to toggle Grid / Table view.
3) Pagination updates via URL params (uses useSearchParams()).
4) Create / Edit / Delete products using forms.

**Bonus Features**

1) Debounced search input (prevents multiple API calls).
2) Optimistic UI updates on Create, Update, Delete.
3) Suspense boundaries for components using useSearchParams().
4) Fully responsive layout.
