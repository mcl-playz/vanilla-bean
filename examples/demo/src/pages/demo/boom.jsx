import { Head } from "vanilla-bean";

export default function Boom() {
  throw new Error("this demo throws on render");
  return <p>unreachable</p>;
}
