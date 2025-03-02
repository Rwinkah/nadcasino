"use client";

import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { Bodies, Body, Common, Composite, Engine, Events, Render, Runner } from "matter-js";
import { decomp } from "poly-decomp-es";
import { useAccount } from "wagmi";
import SetMedal from "~~/components/setMedal";
import { Button } from "~~/components/ui/button";
import { Game } from "~~/services/api/game";

const testData = [
  { wallet: "0xA1B2C3D4E5F67890123456789ABCDEF012345678", score: 1200 },
  { wallet: "0xB2C3D4E5F67890123456789ABCDEF012345678A1", score: 950 },
  { wallet: "0xC3D4E5F67890123456789ABCDEF012345678A1B2", score: 1340 },
  { wallet: "0xD4E5F67890123456789ABCDEF012345678A1B2C3", score: 780 },
  { wallet: "0xE5F67890123456789ABCDEF012345678A1B2C3D4", score: 2000 },
  { wallet: "0xF67890123456789ABCDEF012345678A1B2C3D4E5", score: 850 },
  { wallet: "0x67890123456789ABCDEF012345678A1B2C3D4E5F", score: 1550 },
  { wallet: "0x7890123456789ABCDEF012345678A1B2C3D4E5F6", score: 640 },
  { wallet: "0x890123456789ABCDEF012345678A1B2C3D4E5F67", score: 1720 },
  { wallet: "0x90123456789ABCDEF012345678A1B2C3D4E5F678", score: 1380 },
];

export default function MolandakRun() {
  const collisionSound = new Howl({
    src: ["/sound-effects/die(1).mp3"], // Replace with the path to your sound file
    volume: 1.0, // Set volume (0.0 to 1.0)
  });
  const { address: connectedAddress } = useAccount();
  const game = new Game();
  const [showGame, setShowGame] = useState<boolean>(false);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef(Engine.create()); // Store engine in useRef
  const renderRef = useRef<Render | null>(null); // Store render instance to clean it up
  const [Gameover, setGameover] = useState<boolean>(false);

  const [score, setScore] = useState(0);
  let pipes: Body[] = [];

  function GameStart() {
    setShowGame(true);

    // restartGame();
  }

  useEffect(() => {
    if (!showGame) {
      return;
    }
    // setGameover(false);
    Common.setDecomp(decomp);
    const engine = engineRef.current;

    // ✅ Prevent multiple render instances by checking if one exists
    if (renderRef.current) {
      Render.stop(renderRef.current);
      renderRef.current.canvas.remove(); // Remove the existing canvas from DOM
      renderRef.current = null;
    }

    const parentWidth = sceneRef.current?.clientWidth || window.innerWidth;

    const render = Render.create({
      element: sceneRef.current as HTMLDivElement,
      engine: engine,
      options: {
        width: parentWidth,
        height: 600,
        wireframes: false,
        background: "/background-purple.jpeg",
      },
    });

    renderRef.current = render; // Store render instance in ref

    let lastPipeTime = engine.timing.timestamp;
    const bird = Bodies.circle(150, 300, 20, {
      restitution: 0.25,
      inertia: Infinity,
      label: "bird",
      render: {
        sprite: {
          texture: "/mon.png",
          yScale: 0.04,
          xScale: 0.04,
        },
      },
    });

    Body.setVelocity(bird, { x: 3, y: 0 });
    const ground = Bodies.rectangle(400, 590, 800, 20, {
      isStatic: true,
      label: "ground",
      render: {
        fillStyle: "transparent",
      },
    });
    const ceiling = Bodies.rectangle(400, 10, 800, 20, {
      isStatic: true,
      label: "ceiling",
      render: {
        fillStyle: "transparent",
      },
    });

    Composite.add(engine.world, [bird, ground, ceiling]);
    const spawnPipe = () => {
      let canvasWidth;

      if (renderRef.current) {
        canvasWidth = renderRef.current?.options.width; // Get dynamic width or default to 800
        console.log(canvasWidth, "is canvas width");
      }
      const pipeX = canvasWidth || 800;

      const gap = 150;
      const pipeHeight = 600;
      const pipeTopHeight = Math.random() * 200 + 100; // Random top pipe height
      const pipeBottomHeight = pipeHeight - pipeTopHeight - gap; // Adjust bottom pipe height

      // 🔹 Pipe Top: Positioned from the top down
      const pipeTop = Bodies.rectangle(pipeX, pipeTopHeight / 2, 50, pipeTopHeight, {
        isStatic: true,
        label: "pipe",
        render: { fillStyle: "purple" },
      });

      // 🔹 Pipe Bottom: Positioned from the bottom up
      const pipeBottom = Bodies.rectangle(
        pipeX,
        600 - pipeBottomHeight / 2, // Adjusted position to stay at bottom
        50,
        pipeBottomHeight,
        {
          isStatic: true,
          label: "pipe",
          render: { fillStyle: "purple" },
        },
      );

      pipes.push(pipeBottom, pipeTop);

      // Add objects to the Matter.js world
      Composite.add(engine.world, [pipeTop, pipeBottom]);

      // setSpawnDirection(prev => {
      //   if (prev) {
      //     Composite.add(engineRef.current.world, [pipeTop]);
      //     pipes.push(pipeTop);
      //   } else {
      //     Composite.add(engineRef.current.world, [pipeBottom]);
      //     pipes.push(pipeBottom);
      //   }
      //   return !prev; // ✅ Correctly toggles spawnDirection
      // });
    };

    // Track the last spawned pipe's position

    // Function to control pipe spawning based on distance traveled
    const updatePipes = () => {
      const currentTime = engine.timing.timestamp;

      // Ensure pipes are spawned every 1500ms (1.5 seconds)
      if (currentTime - lastPipeTime >= 750) {
        spawnPipe();
        lastPipeTime = currentTime;
        setScore(prev => prev + 1);
      }

      // Remove pipes that go off-screen
      pipes = pipes.filter(pipe => {
        if (pipe.position.x < -50) {
          Composite.remove(engine.world, pipe);
          return false;
        }
        return true;
      });
    };

    // Call updatePipes inside your game loop
    Events.on(engine, "beforeUpdate", updatePipes);

    // Move pipes left and remove them when they go off-screen
    const movePipes = () => {
      pipes.forEach((pipe, index) => {
        Body.translate(pipe, { x: -3, y: 0 }); // ✅ Moves left while staying upright

        // Remove pipes when they go off-screen
        if (pipe.position.x < -50) {
          Composite.remove(engine.world, pipe);
          pipes.splice(index, 1); // Remove from array
        }
      });
    };

    // Run movePipes every frame
    Events.on(engine, "beforeUpdate", movePipes);

    // Move pipes left and remove them when off-screen

    // Run movePipes every frame
    Events.on(engine, "beforeUpdate", movePipes);

    // const pipeInterval = setInterval(() => {
    //   spawnPipe();
    //   setScore(prev => prev + 1);
    // }, 3000);

    Events.on(engine, "collisionStart", event => {
      event.pairs.forEach(async pair => {
        if (
          (pair.bodyA.label === "bird" && pair.bodyB.label === "pipe") ||
          (pair.bodyA.label === "pipe" && pair.bodyB.label === "bird")
        ) {
          Render.stop(render);
          Runner.stop(runner);
          setGameover(true);
          console.log("valid freeze");
          collisionSound.play();
          await game.post_molandak_highscore({ score: score, player: connectedAddress });

          // restartGame(); // Restart the game
        }
      });
    });

    const runner = Runner.create();
    Render.run(render);
    Runner.run(runner, engine);

    async function handleJump() {
      Body.setVelocity(bird, { x: 0.03, y: -6 });
      await game.post_molandak_jump(connectedAddress);
    }

    window.addEventListener("keydown", handleJump);

    return () => {
      window.removeEventListener("keydown", handleJump);
      // clearInterval(pipeInterval);

      Runner.stop(runner);
      if (renderRef.current) {
        Render.stop(renderRef.current);
        renderRef.current.canvas.remove();
        renderRef.current = null;
      }

      Composite.clear(engine.world, false);

      if (engineRef.current) {
        Engine.clear(engineRef.current);
        // engineRef.current = null;
      }
    };
  }, [showGame]);

  return (
    <div className="lg:flex-row flex flex-col  gap-10  h-full  items-center justify-center w-full">
      <div>
        <div id="molandak__header" className="  h-full font-bold text-lg text-white">
          score: {score}
        </div>
        {showGame ? (
          <div
            ref={sceneRef}
            style={{
              backgroundImage: `url('/background-purple.jpeg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="game-container w-[80vw] lg:w-[50vw] h-[600px]"
          />
        ) : (
          <div
            style={{
              // backgroundImage: `url('/background-purple.jpeg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="game-container border border-purple-500 rounded-2xl  w-[80vw] lg:w-[50vw] h-[600px] flex flex-col items-center justify-center"
          >
            <p className="font-bold text-white text-[40px]">Molandak Run</p>
            <Button className="shadow-purple-500 font-semibold text-[22px]" onClick={GameStart}>
              Start Game
            </Button>
          </div>
        )}
        {Gameover && (
          <div>
            <p>Game over</p>
            <p>{score}</p>
            <Button onClick={() => window.location.reload()}>Restart Game</Button>
          </div>
        )}
      </div>
      <div>
        <p className="font-bold text-xl text-white">Leaderboard</p>
        <div className="h-[530px] overflow-hidden  overflow-y-scroll w-full lg:w-[30vw] border border-purple-500 rounded-2xl shadow-lg shadow-purple-500 bg-transparent">
          {/* {testData
            .sort((a, b) => b.score - a.score)
            .map((item, index) => (
              <div key={index} className="flex pb-10 flex-col gap-4 mt-5 w-full items-center px-10">
                <div className="max-w-[750px] border border-[#D9D9D933] flex justify-between items-center gap-5 w-full h-[65px] p-4 font-medium text-white">
                  <div className="w-10">{SetMedal(index)}</div>
                  <div className="w-full flex justify-between items-center">
                    <div title={item.wallet}>{item.wallet.slice(0, 4) + "..." + item.wallet.slice(-4)}</div>
                    <div>{item.score} OXP</div>
                  </div>
                </div>
              </div>
            ))} */}

          <p className="text-primary font-bold shadow shadow-purple-500 text-[30px] text-center">Unavailable</p>
        </div>
      </div>
    </div>
  );
}
