import Plinko from "../plinko/page";

export default function Page() {
  return (
    <div className="h-screen w-full items-center flex justify-center">
      <Plinko stressTest={true} />
    </div>
  );
}
