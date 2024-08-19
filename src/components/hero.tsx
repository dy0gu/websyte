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
			{letters.map((letter, index) => (
				// biome-ignore lint/a11y/useValidAriaProps: aria-description is a valid aria
				<b
					// biome-ignore lint/suspicious/noArrayIndexKey: mapped object is static
					key={index}
					aria-description={letter.aria}
					tabIndex={letter.onClick ? 0 : -1}
					role={letter.onClick ? "button" : undefined}
					onClick={letter.onClick}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							letter.onClick?.();
						}
					}}
					className="hover:text-zinc-400 duration-500 cursor-pointer"
				>
					{letter.value}
				</b>
			))}
		</h1>
	);
}

const name = [
	{
		value: "D",
		aria: "Play the pun drums sound!",
		onClick: () => sound(drums),
	},
	{
		value: "Y",
		aria: "Play the Windows XP error sound!",
		onClick: () => sound(error),
	},
	{
		value: "0",
		aria: "Play the Vine boom sound!",
		onClick: () => sound(boom, { volume: 0.2 }),
	},
	{
		value: "G",
		aria: "Play the Among Us imposter reveal sound!",
		onClick: () => sound(amogus),
	},
	{ value: "U", aria: "Play a duck quack sound!", onClick: () => sound(quack) },
];

export { Hero, name };
