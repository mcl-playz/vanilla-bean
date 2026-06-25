import { Head, signal } from "vanilla-bean";
import { Button } from "../../components/button";

function Counter() {
  const count = signal(0);
  return <Button onClick={() => count++}>count: {count}</Button>;
}

export default () => <Counter />;
