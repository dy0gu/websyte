import { cn } from "~/utils/cn";

type HeroProps = {
	className?: string;
	title: string;
};

function Hero({ className, title }: HeroProps) {
	return (
		<h1
			className={cn(
				"text-white z-10 text-6xl md:text-7xl lg:text-8xl select-none",
				className,
			)}
		>
			{title.split("").map((letter) => (
				<b
					key={letter}
					className="hover:text-zinc-500 duration-500 cursor-pointer"
				>
					{letter}
				</b>
			))}
		</h1>
	);
}

const name = "DY0GU";

export { Hero, name };
