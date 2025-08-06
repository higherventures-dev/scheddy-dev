export default function ErrorPage() {
   return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">An error occurred</h1>
        <p className="mt-2 text-gray-700">
          Sorry, something went wrong. Please try again or contact support.
        </p>
        <a href="/auth/sign-in" className="text-blue-500 underline mt-4 block">
          Return to Sign In
        </a>
      </div>
    </div>
  );
}