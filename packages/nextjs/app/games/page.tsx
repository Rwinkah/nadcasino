import Plinko from "../plinko/page";
import { Separator } from "~~/components/ui/separator";

export default function page() {
  return (
    <div
      id="games"
      className="gradientpage flex flex-col overflow-x-hidden w-fit max-w-[1512px] items-start mt-[136px] justify-center"
    >
      <div id="games__header" className="w-full overflow-x-hidden">
        <div id="games__header__container" className=" bg-[#070322] w-full gap-[14px] flex flex-col">
          <div id="games__header__container__top " className="flex flex-col ">
            <h2 className="text-white m-0">Games/plinko</h2>
          </div>
          <div id="games__header__container__bottom" className="flex justify-between mb-4 items-center">
            <h1 className="m-0 font-medium text-[32px]">Plinko</h1>
            <div
              id="games__header__container__bottom__tokens"
              className="gradient-game-header p-[1px] w-[244px] h-[60px] rounded-md"
            >
              <div className="bg-[#070322] rounded-md  w-full h-full"></div>
            </div>
          </div>
          <Separator id="separator" className="gradient-game-header h-[1px] w-full" />
        </div>
        <div className="absolute  top-[5%] inset-0 h-[70vh] w-[35vw] 2xl:hidden   bg-[#E705D8] opacity-5 rounded-full blur-3xl" />
      </div>
      <div id="games__body " className="flex flex-col mt-[40px]">
        <Plinko stressTest={false} />{" "}
      </div>
    </div>
  );
}
