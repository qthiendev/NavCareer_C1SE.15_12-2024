// Layout.js
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <header>
        <h1>My App</h1>
        {/* You can add navigation or other layout items here */}
      </header>
      <main>
        <Outlet /> {/* Renders the matching child route component */}
      </main>
      <footer>
        <p>© 2024 My App</p>
      </footer>
    </div>
  );
}

export default Layout;
