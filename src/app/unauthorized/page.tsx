export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">Unauthorized</h1>
        <p className="mt-2 text-gray-700">
          You don’t have permission to access this page.
        </p>
        <a href="/auth/sign-in" className="text-blue-500 underline mt-4 block">
          Go back to sign in
        </a>
      </div>
    </div>
  );
}