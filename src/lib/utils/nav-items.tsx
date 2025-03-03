const navItems = [
  {
    title: "Collections",
    path: "/collections",
    hasDropdown: true,
    dropdown: [
      {
        title: "New Arrivals",
        href: "/collections/new-arrivals",
        value: "new_arrivals",
        label: "New Arrivals",
      },
      {
        title: "Journals",
        label: "Journals",
        href: "/collections/journal",
        value: "journals",
      },
      {
        title: "Pens",
        label: "Pens",
        href: "/collections/pens",
        value: "pens",
      },
      {
        title: "Stickers",
        label: "Stickers",
        href: "/collections/stickers",
        value: "stickers",
      },
      {
        title: "Highlighters",
        label: "Highlighters",
        href: "/collections/highlighters",
        value: "highlighters",
      },
    ],
  },
  {
    title: "All products",
    path: "/products",
  },
];

export default navItems;
