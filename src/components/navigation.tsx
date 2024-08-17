import { cn } from "~/utils/cn";

type NavigationProps = {
	className?: string;
	links: { name: string; href: string }[];
};

function Navigation({ className, links }: NavigationProps) {
	return (
		<nav className={cn("my-16 mx-16 animate-fade-in", className)}>
			<ul className="flex flex-row text-sm md:text-md lg:text-xl select-none">
				{links.map((item, index) => (
					<li key={item.href}>
						<a
							href={item.href}
							className="duration-500 text-zinc-500 hover:text-zinc-300"
						>
							{item.name}
						</a>
						{index < links.length - 1 && (
							<span className="mx-3 text-white">•</span>
						)}
					</li>
				))}
			</ul>
		</nav>
	);
}

export { Navigation };
