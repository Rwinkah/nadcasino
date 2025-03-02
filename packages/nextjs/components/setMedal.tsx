import OnboardMeBronzeMedalIcon from "./assets/onboardMeBronzeMedal";
import OnboardMeGoldMedalIcon from "./assets/onboardMeGoldMedal";
import OnboardMeSilverMedalIcon from "./assets/onboardMeSilverMedal";

export default function SetMedal(index: number) {
  index++;
  if (index == 1) {
    return (
      <span>
        <OnboardMeGoldMedalIcon size={36} />
      </span>
    );
  } else if (index == 2) {
    return (
      <span>
        <OnboardMeSilverMedalIcon size={36} />
      </span>
    );
  } else if (index == 3) {
    return (
      <span>
        <OnboardMeBronzeMedalIcon size={36} />
      </span>
    );
  } else {
    return <span className="font-medium text-white">{index}</span>;
  }
}
