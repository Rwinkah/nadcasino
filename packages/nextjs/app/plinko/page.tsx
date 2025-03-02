"use client";

import React, { useEffect, useRef, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Bodies, Body, Common, Composite, Engine, Events, Render, Runner } from "matter-js";
import { decomp } from "poly-decomp-es";
// import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { Separator } from "~~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";
// import { useScaffoldContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Game } from "~~/services/api/game";
import { type PlinkoInterface } from "~~/services/api/game-types";

const Multipliers = {
  "8": {
    low: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
    medium: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
    high: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
  },
  "9": {
    low: [5.6, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 5.6],
    medium: [18, 4, 1.7, 0.9, 0.5, 0.5, 0.9, 1.7, 4, 18],
    high: [43, 7, 2, 0.6, 0.2, 0.2, 0.6, 2, 7, 43],
  },
  "10": {
    low: [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
    medium: [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22],
    high: [76, 10, 3, 0.9, 0.3, 0.2, 0.3, 0.9, 3, 10, 76],
  },
  "11": {
    low: [8.4, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 8.4],
    medium: [24, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 24],
    high: [120, 14, 5.2, 1.4, 0.4, 0.2, 0.2, 0.4, 1.4, 5.2, 14, 120],
  },
  "12": {
    low: [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
    medium: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
    high: [170, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.2, 0.7, 2, 8.1, 24, 170],
  },
};

const colors = ["#CC5806", "#F86E0C", "#FA8C3D", "#FBA96F"];

interface CollisionData {
  [risk: string]: {
    [numRows: number]: {
      [multiplier: number]: Set<number>; // Set of posX values
    };
  };
}

const collisionData: CollisionData = {};

export default function Plinko({ stressTest }: PlinkoInterface) {
  const { address: connectedAddress, isConnected } = useAccount();

  const game = new Game();
  enum Risk {
    Medium = "medium",
    Low = "low",
    High = "high",
  }
  const [rows, setRows] = useState<number>(8);
  const sceneRef = useRef<HTMLDivElement>(null); // Create a ref for the rendering container
  const engineRef = useRef(Engine.create()); // Store engine in useRef
  const obstaclesRef = useRef<Body[]>([]);
  const sinkRef = useRef<Body[]>([]);
  const ballRef = useRef<Body[]>([]);
  // const shockwavesRef = useRef<HTMLDivElement[]>([]); // Store shockwave divs
  const [amount, setAmount] = useState<number>(0.0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [risk, setRisk] = useState<Risk>(Risk.Low);
  const [showNum, setShowNum] = useState<{ id: number; value: number }[]>([]);
  // const [multiplierRender, setMultiplierRender] = useState<boolean>(false);
  const rowsRef = useRef(rows);
  const riskRef = useRef(risk);

  // const { data: GameContract } = useScaffoldContract({ contractName: "Game" });
  // const { writeContractAsync } = useScaffoldWriteContract({
  //   contractName: "Game",
  // });

  async function BreakMonad() {
    await game.post_report_collision(connectedAddress);
  }
  useEffect(() => {
    console.log(showNum.length, "Current length of shownum");
    // Set up matterjs

    // Enable concave decomposition support
    Common.setDecomp(decomp);

    const engine = engineRef.current;
    const render = Render.create({
      element: sceneRef.current as HTMLDivElement, // Attach to div instead of document.body
      engine: engine,
      options: {
        width: 800,
        height: 700,
        wireframes: false,
        background: "#070322",
      },
    });

    const runner = Runner.create();

    Render.run(render);
    Runner.run(runner, engine);

    // function createShockwave(x: number, y: number) {
    //   const shockwave = document.createElement("div");
    //   shockwave.style.position = "absolute";
    //   shockwave.style.left = `${x - 5}px`;
    //   shockwave.style.top = `${y - 5}px`;
    //   shockwave.style.width = "10px";
    //   shockwave.style.height = "10px";
    //   shockwave.style.border = "2px solid white";
    //   shockwave.style.borderRadius = "50%";
    //   shockwave.style.opacity = "1";
    //   shockwave.style.pointerEvents = "none";
    //   sceneRef.current?.appendChild(shockwave);
    //   shockwavesRef.current.push(shockwave);

    //   // Expand and fade out
    //   let size = 10;
    //   let opacity = 1;
    //   const interval = setInterval(() => {
    //     size += 4;
    //     opacity -= 0.05;
    //     shockwave.style.width = `${size}px`;
    //     shockwave.style.height = `${size}px`;
    //     shockwave.style.left = `${x - size / 2}px`;
    //     shockwave.style.top = `${y - size / 2}px`;
    //     shockwave.style.opacity = `${opacity}`;

    //     if (opacity <= 0) {
    //       clearInterval(interval);
    //       shockwave.remove();
    //       shockwavesRef.current = shockwavesRef.current.filter(el => el !== shockwave);
    //     }
    //   }, 30);
    // }

    Events.on(engine, "collisionStart", function (event) {
      (async () => {
        if (stressTest) {
          BreakMonad();
        }
      })();
      const pairs = event.pairs;

      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];

        if (
          (pair.bodyA.label === "dropball" && pair.bodyB.label === "sink") ||
          (pair.bodyA.label === "sink" && pair.bodyB.label === "dropball")
        ) {
          const dropBall = pair.bodyA.label === "dropball" ? pair.bodyA : pair.bodyB;
          const sink = pair.bodyA.label === "sink" ? pair.bodyA : pair.bodyB;

          const multiplier = sink.plugin?.multiplier;
          const dropBallX = dropBall.plugin?.originalX;

          if (!collisionData[riskRef.current.toString()]) {
            collisionData[riskRef.current.toString()] = {};
          }
          if (!collisionData[riskRef.current.toString()][rowsRef.current]) {
            collisionData[riskRef.current.toString()][rowsRef.current] = {};
          }
          if (!collisionData[riskRef.current.toString()][rowsRef.current][multiplier]) {
            collisionData[riskRef.current.toString()][rowsRef.current][multiplier] = new Set<number>();
          }

          collisionData[riskRef.current.toString()][rowsRef.current][multiplier].add(dropBallX);
          console.log(
            riskRef.current,
            "is riks",
            rowsRef.current,
            "is rows",
            multiplier,
            "is multiplier",
            dropBallX,
            "is posx",
          );

          console.log(collisionData, "is collision data");
          // Use only React state
          setShowNum(prev => [...prev, { id: Date.now(), value: multiplier }]);

          Composite.remove(engine.world, dropBall);
          ballRef.current.pop();
          // setTimeout(() => {
          //   setShowNum(prev => prev.slice(1));
          // }, 800);
        }
      }
      // if (stressTest) {

      // }
    });
    // Attach custom rendering function to Matter.Render
    Events.on(render, "afterRender", function () {
      const ctx = render.context; // Get the canvas context

      ctx.fillStyle = "white"; // Text color
      ctx.font = "bold 14px Arial"; // Font style
      ctx.textAlign = "center"; // Center the text horizontally

      // Loop through all sink bodies and render their multipliers
      engine.world.bodies.forEach(body => {
        if (body.label === "sink") {
          const multiplier = (body as any).plugin?.multiplier || 1.0; // Default multiplier if missing

          ctx.fillText(
            multiplier.toFixed(2), // Convert multiplier to a 2-decimal string
            body.position.x, // X position of the sink
            body.position.y + 5, // Y position of the sink
          );
        }
      });
    });

    // Cleanup function to prevent memory leaks
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  useEffect(() => {
    // Draw the scene
    const engine = engineRef.current;

    Composite.remove(engine.world, obstaclesRef.current);
    Composite.remove(engine.world, sinkRef.current);
    obstaclesRef.current = [];
    sinkRef.current = [];
    // const boxA = Bodies.circle(350, 50, 5, { render: { fillStyle: "#ff0000" } });
    // const boxB = Bodies.rectangle(450, 50, 80, 80, { isStatic: true });
    // const ground = Bodies.rectangle(400, 580, 810, 40, { isStatic: true });
    // const circleA = Bodies.circle(400, 50, 5, { isStatic: true });

    const obstacleSpacing = 50;
    const rowSpacing = 50;
    const startObstacleX = 400;
    const startSinkX = 425;
    const sinkGap = 5;
    const sinkWidth = 42;
    const sinkHeight = Math.floor(sinkWidth * 0.8);
    const sinkDistance = sinkWidth + sinkGap;

    const obstacleSize = 6;
    const startObstacleY = 50;

    function DrawScene() {
      let circleY = 0;
      for (let i = 0; i < rows; i++) {
        const numBalls = i + 3;
        let lower = -Math.floor(numBalls / 2);
        const higher = Math.floor(numBalls / 2);

        for (; lower <= higher; lower++) {
          const even = numBalls % 2 === 0;

          if (even && lower === higher) {
            continue;
          }

          const circleX = !even
            ? startObstacleX + lower * obstacleSpacing
            : startObstacleX + 25 + lower * obstacleSpacing;
          circleY = startObstacleY + i * rowSpacing;
          const newCirlce = Bodies.circle(circleX, circleY, obstacleSize, {
            isStatic: true,
            render: {
              fillStyle: "#ffffff",
            },
            label: "obstacle",
          });
          if (i === rows - 2) {
            const newSink = Bodies.rectangle(circleX, circleY + 100, sinkWidth, sinkHeight, {
              isStatic: true,
              label: "sink",
              collisionFilter: {
                group: 1,
              },
              render: {
                fillStyle: "#874AF6",
              },
              plugin: {
                multiplier:
                  Multipliers[rows.toString() as keyof typeof Multipliers][risk as "low" | "medium" | "high"][
                    higher + lower
                  ],
              },
            });
            sinkRef.current.push(newSink);
          }
          newCirlce;
          obstaclesRef.current.push(newCirlce);
        }
      }
    }

    // function DrawSinks(rows: number, sinkY: number) {
    //   sinkY += 30;
    //   let lower = -Math.floor(rows / 2);
    //   let higher = Math.floor(rows / 2);
    //   for (; lower < higher; lower++) {
    //     let sinkX = startSinkX + lower * sinkDistance;

    //     let newSink = Bodies.rectangle(sinkX, sinkY, sinkWidth, sinkHeight, { isStatic: true });
    //     sinkRef.current.push(newSink);
    //   }
    // }
    DrawScene();
    Composite.add(engine.world, [...obstaclesRef.current]);
    Composite.add(engine.world, [...sinkRef.current]);
    rowsRef.current = rows;
    riskRef.current = risk;
  }, [rows, risk]);
  useEffect(() => {
    if (!sceneRef.current || showNum.length === 0) return;

    // showNum.forEach(div => {
    //   console.log(div);
    //   if (showNum.length > 4) {
    //     let element = document.getElementById(div.toString());
    //     console.log(element, "is my current div");
    //     if (element) {
    //       sceneRef.current?.removeChild(element);
    //     }
    //   }
    // });

    const latestValue = showNum[showNum.length - 1];
    // const posY = 20 + (showNum.length - 1) * 33;
    const divColor = colors[showNum.length % 4];

    const div = document.createElement("div");
    div.id = `${latestValue.id}`;
    div.textContent = `x${latestValue.value.toFixed(2)}`;
    div.style.cssText = `
      background-color: ${divColor};
      position: absolute;
      right: 20px;
      top: 20px;
      color: black;
      font: 14px Arial;
      width: 64px;
      height: 56px;
      border-radius: 8px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const existingDivs = sceneRef.current.querySelectorAll("div");
    existingDivs.forEach(existingDiv => {
      if (existingDiv.id !== div.id) {
        const currentTop = parseInt(existingDiv.style.top, 10);
        existingDiv.style.top = `${currentTop + 60}px`; // Push down by 60px
        if (parseInt(existingDiv.style.top) > 240) {
          sceneRef.current?.removeChild(existingDiv);
        }
      }
    });
    // if (Date.now() - latestValue.id < 2000) {
    sceneRef.current.appendChild(div);
    // }

    // // Remove div after 1 second
    // const timeout = setTimeout(() => {
    //   sceneRef.current?.removeChild(div);
    //   setShowNum(prev => prev.slice(1)); // Remove from state
    //   // showNum.pop();
    // }, 1000);

    // // Cleanup if unmounted
    // return () => clearTimeout(timeout);
  }, [showNum]);

  useEffect(() => {
    if (ballRef.current.length > 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [ballRef.current]); // Runs whenever ballRef.current changes

  async function DropBall() {
    // for (let i = 0; i < 300; i++) {

    const dropData = await game.post_plinko_multiplier({
      risk: risk.toString(),
      rows: rows.toString(),
      clientSecret: "",
      value: amount,
      wallet: connectedAddress,
    });

    const multiplierKey: string = Object.keys(dropData.multiplier)[0];
    const dropBallX = parseFloat(multiplierKey);
    const value = dropData.multiplier[multiplierKey];
    console.log(dropBallX, "is dropball x", value, "is value");

    console.log(risk, "is risk", rows, "is rows");

    const newDropBall = Bodies.circle(dropBallX, 50, 8, {
      render: { fillStyle: "#ff0000" },
      label: "dropball",
      restitution: 1,
      collisionFilter: {
        group: -1,
      },
      plugin: {
        originalX: dropBallX,
      },
    });
    Body.setMass(newDropBall, 0.5);

    ballRef.current.push(newDropBall);
    Composite.add(engineRef.current.world, newDropBall);
    // }
  }

  const handleRowChange = (value: string) => {
    if (ballRef.current.length > 0) {
      return;
    } else {
      const intval = parseInt(value);
      console.log("ball row changed");
      console.log(value, intval, "is the new row value");
      setRows(intval); // Update rows state based on selected value
    }
  };
  const handleRiskChange = (value: string) => {
    if (ballRef.current.length > 0) {
      return;
    } else {
      setRisk(value as Risk);
    }
  };

  function updateAmount(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseFloat(e.target.value);
    setAmount(value);
  }

  // function downloadCollisionData() {
  //   const convertSetsToArrays = (data: CollisionData): CollisionData => {
  //     const result: CollisionData = {};

  //     for (const risk in data) {
  //       if (data.hasOwnProperty(risk)) {
  //         result[risk] = {};

  //         for (const numRows in data[risk]) {
  //           if (data[risk].hasOwnProperty(numRows)) {
  //             result[risk][numRows] = {};

  //             for (const multiplier in data[risk][numRows]) {
  //               if (data[risk][numRows].hasOwnProperty(multiplier)) {
  //                 // Convert Set to Array using Array.from
  //                 result[risk][numRows][multiplier] = Array.from(data[risk][numRows][multiplier]);
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }

  //     return result;
  //   };

  //   const setToArray = convertSetsToArrays(collisionData);
  //   console.log(setToArray, "Is set converted?");
  //   const jsonData = JSON.stringify(setToArray, null, 2);
  //   const blob = new Blob([jsonData], { type: "application/json" });
  //   const url = URL.createObjectURL(blob);

  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "collisions.json";
  //   a.click();

  //   URL.revokeObjectURL(url);
  // }
  return (
    <div className={`flex   w-full  items-center justify-center h-full  gap-6 `}>
      <div className=" border-[#333947] bg-[#070322] border rounded-[32px] lg:h-[700px] w-[400px]">
        <Tabs defaultValue="manual" className="flex flex-col items-center  p-4">
          <TabsList className="bg-[#09011C] border border-[#333947]  h-[66px] rounded-[24px] lg:w-[360px] flex items-center  justify-center">
            <TabsTrigger className="w-full h-[90%] rounded-[16px]" value="manual">
              Manual
            </TabsTrigger>
            <TabsTrigger disabled={true} className="w-full cursor-disabled h-[90%] rounded-[16px]" value="auto">
              Auto
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="flex flex-col mt-8 w-full gap-10 items-center">
            {!stressTest && (
              <div className="flex flex-col w-full gap-2">
                <div className="flex w-full justify-between">
                  <span>Bet Amount</span>
                  <span>$0.00</span>
                </div>

                <div className="w-full flex h-[50px]  gradient-game-header p-[1px]">
                  <Input
                    onChange={updateAmount}
                    value={amount}
                    placeholder="0"
                    type="number"
                    step="0.0001"
                    className="min-w-[60%] border-none outline-none rounded-none  bg-[#09011C] font-medium text-white h-full"
                  />
                  <div></div>
                  <Button
                    onClick={() => {
                      setAmount(prevAmount => prevAmount / 2);
                    }}
                    className="flex shrink-0 h-full bg-[#21123D] rounded-none"
                  >
                    1/2
                  </Button>
                  <div className="bg-[#21123D] items-center flex h-full">
                    <Separator className="bg-[#09011C] h-4/5 w-[2px]" orientation="vertical" />
                  </div>
                  <Button
                    onClick={() => setAmount(prevAmount => prevAmount * 2)}
                    className="h-full flex shrink-0 bg-[#21123D] rounded-none"
                  >
                    2
                  </Button>
                </div>
              </div>
            )}
            <div className="flex flex-col w-full gap-2">
              <div className="flex w-full justify-between">
                <span>Risk</span>
              </div>
              <div className="w-full flex h-[50px]  gradient-game-header p-[1px]">
                <Select defaultValue={risk.toString()} value={risk.toString()} onValueChange={handleRiskChange}>
                  <SelectTrigger className="min-w-[60%]  border-none outline-none rounded-none  bg-[#09011C] font-medium text-white h-full">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent className="font-medium text-white bg-[#09011C]">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col w-full gap-2">
              <div className="flex w-full justify-between">
                <span>Rows</span>
              </div>
              <div className="w-full flex h-[50px]  gradient-game-header p-[1px]">
                <Select defaultValue={rows.toString()} value={rows.toString()} onValueChange={handleRowChange}>
                  <SelectTrigger
                    disabled={isDisabled}
                    className="min-w-[60%]  border-none outline-none rounded-none  bg-[#09011C] font-medium text-white h-full"
                  >
                    <SelectValue placeholder="Select rows " />
                  </SelectTrigger>
                  <SelectContent className="font-medium text-white bg-[#09011C]">
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {isConnected ? (
              <Button className="w-full" onClick={DropBall}>
                {stressTest ? "Play" : "Bet"}
              </Button>
            ) : (
              <p>Connect Wallet</p>
            )}

            {/* <Button onClick={}>Dowload Test Data</Button> */}
          </TabsContent>
          <TabsContent value="auto">auto</TabsContent>
        </Tabs>
      </div>
      <div className="border border-[#333947] bg-[#070322] rounded-[24px]  shadow-2xl w-[800px] h-[700px] flex flex-col items-center justify-center ">
        <div
          ref={sceneRef}
          style={{
            position: "relative",
          }}
        />
      </div>
      {/* <Button onClick={DropBall}> Dripball</Button>
      <Button onClick={RowSetter}>Set ROw random</Button> */}
    </div>
  );
}
