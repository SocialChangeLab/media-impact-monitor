"use client";

import { useMenu } from "@refinedev/core";
import Link from "next/link";

export const Menu = () => {
  const { menuItems, selectedKey } = useMenu();

  return (
    <nav className="menu">
      <ul>
        {menuItems.map((item) => (
          <li key={item.key}>
            <Link
              href={item.route ?? "/"}
              className={selectedKey === item.key ? "active" : ""}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
