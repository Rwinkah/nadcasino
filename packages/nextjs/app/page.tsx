"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import Link from "next/link";
import multiplierIcon from "../public/multiplier.png";
import { Auth, useTurnkey } from "@turnkey/sdk-react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";
import { Button } from "~~/components/ui/button";
import RocketIcon from "~~/public/assets/icons/Rocket";
import StarIcon from "~~/public/assets/icons/Star";

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const router = useRouter();
  const onAuthSuccess = async () => {
    // We'll add the dashboard route in the next step
    router.push("/dashboard");
  };

  const onError = (errorMessage: string) => {
    console.log("An errror has occured");
  };

  const config = {
    authConfig: {
      emailEnabled: true,
      // Set the rest to false to disable them
      passkeyEnabled: false,
      phoneEnabled: false,
      appleEnabled: false,
      facebookEnabled: false,
      googleEnabled: false,
    },
    // The order of the auth methods to display in the UI
    configOrder: ["email" /* "passkey", "phone", "socials" */],
    onError: onError,
    onAuthSuccess: onAuthSuccess,
  };
  return (
    <>
      <div
        // style={{ backgroundImage: "url(/shine.png)" }}
        className=" bg-cover  flex items-center justify-center flex-col w-[100%] min-h-[950px]"
      >
        <div
          style={{ backgroundImage: "url(/shine.png)" }}
          className="w-full right-0 absolute top-0 z-0 bg-cover h-[970px]"
        />
        <div
          className=" flex mt-[100px] lg:mt-[400px] w-full flex-col items-center justify-center lg:max-w-[950px]  text-center"
          id="home__hero "
        >
          <h1 className=" lg:max-w-[950px] md:text-[80px] text-[40px]  font-semibold ">
            EXPERIENCE NEXT-GEN <span className="gradient-hero-text">BLOCKCHAIN GAMING </span>
          </h1>
          <p className="text-[26px] font-normal">
            Welcome to Monad Casino combining blockchain innovation with classic gaming. Enjoy instant transactions,
            fair play, and high-multiplier wins!
          </p>
          <div id="home__hero__cta" className="flex items-center justify-center gap-4 mt-16 mb-24">
            <Button className="flex items-center justify-center bg-[#917CF7] font-bold text-sm  rounded-full max-w-[123px] mt-9">
              Play Now <ArrowRightIcon />
            </Button>
          </div>
          <div className="lg:flex-row flex flex-col gap-9 px-5 lg:px-0  w-fit">
            <div
              className=" lg:w-[375px] border rounded-3xl px-10  text-center border-gray-400 lg:h-[200px]"
              style={{ backgroundImage: "url(/shine.png)" }}
            >
              <div className=" relative top-[-30px] mx-auto gradient-hero-card-circle size-[75px] rounded-full flex items-center justify-center border border-[#CB97FF]">
                <RocketIcon />
              </div>
              <div className="flex justify-between relative top-[-45px]">
                <StarIcon />
                <StarIcon />
              </div>
              <p className="text-3xl m-0">Lightning Fast</p>
              <p className="text-[0.82rem]">
                Powered by Monad&apos;s 10,000 TPS blockchain for instant transactions and real-time gameplay
              </p>
            </div>
            <div
              className=" lg:w-[375px] border rounded-3xl px-10  text-center border-gray-400 lg:h-[200px]"
              style={{ backgroundImage: "url(/shine.png)" }}
            >
              <div className=" relative top-[-30px] mx-auto gradient-hero-card-circle size-[75px] rounded-full flex items-center justify-center border border-[#CB97FF]">
                <Image src={"fair.svg"} alt="provably fair" width={20} height={24} />
              </div>
              <div className="flex justify-between relative top-[-45px]">
                <StarIcon />
                <StarIcon />
              </div>
              <p className="text-3xl m-0">Provably Fair</p>
              <p className="text-[0.82rem]">
                Every game outcome is verifiable on-chain, ensuring complete transparency and fairness{" "}
              </p>
            </div>
            <div
              className=" lg:w-[375px] border rounded-3xl px-10  text-center border-gray-400 lg:h-[200px]"
              style={{ backgroundImage: "url(/shine.png)" }}
            >
              <div className=" relative top-[-30px] mx-auto gradient-hero-card-circle size-[75px] rounded-full flex items-center justify-center border border-[#CB97FF]">
                <Image src={multiplierIcon} alt="multiplier" width={24} height={24} />
              </div>
              <div className="flex justify-between relative top-[-45px]">
                <StarIcon />
                <StarIcon />
              </div>
              <p className="text-3xl m-0">High Multipliers</p>
              <p className="text-[0.82rem]">Earn up to 1000x your bet with our exciting range of casino games </p>
            </div>
          </div>
        </div>
        <div
          id="home__plinko"
          className="flex md:flex-row flex-col justify-between max-w-[1200px] w-full mt-[125px] items-center"
        >
          <div id="home__plinko__left" className="max-w-[480px] px-4 lg:px-0 flex flex-col ">
            <h2 className=" m-0 font-medium text-white text-[64px]">Plinko</h2>
            <p className="m-0 mt-2 text-[#D5D3DF] text-[32px]">Drop the ball and watch it bounce to big wins!</p>
            <p className="m-0 mt-5 text-[#D5D3DF] text-lg">Max Multiplier</p>
            <span className="text-[#5CBE8B] font-bold text-[32px] ">1000%</span>
            <Button className="flex items-center justify-center bg-[#917CF7] font-bold text-sm  rounded-full max-w-[123px] mt-9">
              Play Now <ArrowRightIcon />
            </Button>
          </div>
          <div
            style={{ backgroundImage: "url(/plinko.png)" }}
            className="bg-cover lg:w-[480px] lg:h-[480px] w-0 h-0 "
          />
        </div>
        <div
          id="home__mines"
          className="flex lg:flex-row flex-col justify-between max-w-[1200px] w-full mt-[125px] items-center"
        >
          <div id="home__mines__left" className="max-w-[480px] flex flex-col w-full  px-4 lg:px-0 ">
            <h2 className=" m-0 font-medium text-white text-[64px]">Mines</h2>
            <p className="m-0 mt-2 text-[#D5D3DF] text-[32px]">Avoid mines find the gems</p>
            <p className="m-0 mt-5 text-[#D5D3DF] text-lg">Max Multiplier</p>
            <span className="text-[#5CBE8B] font-bold text-[32px] ">100%</span>
            <Button className="flex items-center justify-center bg-[#917CF7] font-bold text-sm  rounded-full max-w-[123px] mt-9">
              Play Now <ArrowRightIcon />
            </Button>
          </div>
          <div style={{ backgroundImage: "url(/mines.png)" }} className="bg-cover lg:w-[480px] lg:h-[480px] w-0 h-0 " />
        </div>
      </div>
    </>
  );
};

export default Home;
