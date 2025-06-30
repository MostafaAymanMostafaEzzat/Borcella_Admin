import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className=" flex justify-center items-center h-screen bg-[rgb(31_31_35)]">
      <SignIn />
    </div>
  );
}
