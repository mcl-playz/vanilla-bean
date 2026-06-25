function builtAt() {
  "use static";
  return new Date().toLocaleTimeString();
}

export default function BuildStamp() {
  "use static";
  return (
    <span>
      server built <strong>{builtAt()}</strong>
    </span>
  );
}
