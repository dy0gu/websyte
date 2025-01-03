import { cn } from "~/utils/cn";
import { sound } from "~/utils/sound";

import amogus from "~/assets/sounds/amogus.mp3";
import boom from "~/assets/sounds/boom.mp3";
import drums from "~/assets/sounds/drums.mp3";
import error from "~/assets/sounds/error.mp3";
import quack from "~/assets/sounds/quack.mp3";

type HeroLetter = {
	value: string;
	aria?: string;
	onClick?: () => void;
};

type HeroProps = {
	letters: HeroLetter[];
	className?: string;
};

function Hero({ letters, className }: HeroProps) {
	return (
		<h1
			className={cn(
				"text-white z-10 text-6xl md:text-7xl lg:text-8xl select-none",
				className,
			)}
		>
			{letters.map((letter) => (
				// biome-ignore lint/a11y/useValidAriaProps: aria-description is a valid aria
				<button
					className="bg-transparent hover:text-zinc-400 font-bold active:text-zinc-500 active:scale-90 duration-200"
					key={letter.aria}
					type="button"
					aria-description={letter.aria}
					onClick={letter.onClick}
				>
					{letter.value}
				</button>
			))}
		</h1>
	);
}

const name = [
	{
		value: "D",
		aria: "Plays the pun drums sound on interaction!",
		onClick: () => sound(drums),
	},
	{
		value: "Y",
		aria: "Plays the Windows XP error sound on interaction!",
		onClick: () => sound(error),
	},
	{
		value: "0",
		aria: "Plays the Vine boom sound on interaction!",
		onClick: () => sound(boom, { volume: 0.2 }),
	},
	{
		value: "G",
		aria: "Plays the Among Us imposter reveal sound on interaction!",
		onClick: () => sound(amogus),
	},
	{
		value: "U",
		aria: "Plays a duck quack sound on interaction!",
		onClick: () => sound(quack),
	},
];

export { Hero, name };
