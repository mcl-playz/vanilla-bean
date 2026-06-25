"use client";

import { useLocation } from "vanilla-bean";

export default () => (
  <div>
    <code>{useLocation().path}</code> isn't a demo.
  </div>
);
