import { cn } from "~/utils/cn";

type HeroProps = {
	className?: string;
	title: string;
};

export function Hero({ className, title }: HeroProps) {
	return (
		<h1
			className={cn(
				`z-10 text-6xl md:text-7xl lg:text-8xl text-transparent duration-1000 bg-white
cursor-default text-edge-outline animate-title font-display bg-clip-text`,
				className,
			)}
		>
			{title.split("").map((letter) => (
				<b key={letter} className="hover:text-zinc-500 duration-500">
					{letter}
				</b>
			))}
		</h1>
	);
}

export const name = "DY0GU";
