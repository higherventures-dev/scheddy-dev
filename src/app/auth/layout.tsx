export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen flex flex-colw-screen h-screen flex flex-col items-start">{children}</div>
  );
}
