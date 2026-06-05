// app/test/page.tsx

export default function TestPage() {
  return (
    <div>
      {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    </div>
  );
}