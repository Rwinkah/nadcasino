"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { address: connectedAddress, isConnected } = useAccount();

  const pathName = usePathname();
  const plinko = pathName === "/breakmonad/plinko";
  return (
    <div className="h-full overflow-scroll w-full items-center flex flex-col justify-center">
      <div className="flex border border-accent gap-10 text-[20px] mt-[140px] font-semibold p-4 rounded-xl">
        <Link
          href="/breakmonad/plinko"
          className={`${pathName === "/breakmonad/plinko" ? "text-white border rounded-lg border-primary  bg-accent" : ""} p-4 btn-primary w-full min-w-[140px] text-center h-full`}
        >
          Plinko
        </Link>

        <Link
          className={`${pathName === "/breakmonad/molandakrun" ? "text-white border rounded-lg border-primary  bg-accent" : ""} p-4 btn-primary w-full min-w-[140px] text-center    h-full`}
          href="/breakmonad/molandakrun"
        >
          Molandakrun
        </Link>
      </div>
      <p className="mb-0 text-center mt-[10px] gradient-active font-semibold text-[40px]">
        Help test the strength of Monad!,
      </p>

      {plinko ? (
        <p className="text-center mt-[10px] mb-[10px]">
          Every collision between the dropball and the obstacles creates a transaction on chain
        </p>
      ) : (
        <p className="text-center mt-[10px] mb-[10px]">Every Molandak jump creates a transaction on chain</p>
      )}

      {/* <Plinko stressTest={true} /> */}
      {isConnected ? (
        <div className="mt-[50px]">{children}</div>
      ) : (
        <p className="text-white mt-[200px] font-semibold text-[30px]">Please connect your wallet</p>
      )}
    </div>
  );
}
