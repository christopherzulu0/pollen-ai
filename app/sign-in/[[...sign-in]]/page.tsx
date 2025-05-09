import { SignIn } from "@clerk/nextjs";


export default function SignInPage() {
  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
        
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none",
              formButtonPrimary: 
                "bg-indigo-600 hover:bg-indigo-700 text-sm normal-case",
              footerActionLink: "text-indigo-600 hover:text-indigo-700",
            },
          }}
          redirectUrl="/"
        />
      </div>
    </div>
    </>
  );
}