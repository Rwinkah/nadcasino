import Plinko from "../plinko/page";

export default function Page() {
  return (
    <div className="h-full overflow-scroll w-full items-center flex flex-col justify-center">
      <p className="mb-0 text-center mt-[140px] gradient-active font-semibold text-[40px]">
        Help test the strength of Monad!,
      </p>
      <p className="text-center mt-0 mb-[100px]">
        Every collision between the dropball and the obstacles creates a transaction on chain
      </p>
      <Plinko stressTest={true} />
    </div>
  );
}
