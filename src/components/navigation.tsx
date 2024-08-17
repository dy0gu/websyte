import { cn } from "~/utils/cn";

type NavigationProps = {
	className?: string;
	links: { name: string; href: string }[];
};

function Navigation({ className, links }: NavigationProps) {
	return (
		<nav className={cn("my-16 mx-16 animate-fade-in", className)}>
			<ul
				className="flex list-none flex-row text-sm md:text-md lg:text-xl
        items-center justify-center marker:text-green list-outside list-disc"
			>
				{links.map((item, index) => (
					<li key={item.href}>
						<a
							href={item.href}
							className="duration-500 text-zinc-500 hover:text-zinc-300"
						>
							{item.name}
						</a>
						{index < links.length - 1 && (
							<span className="mx-3 text-white pointer-events-none">•</span>
						)}
					</li>
				))}
			</ul>
		</nav>
	);
}

export { Navigation };
