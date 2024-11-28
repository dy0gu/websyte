import { cn } from "../utils/cn";

type NavigationProps = {
	className?: string;
	links: { name: string; href: string }[];
};

function Navigation({ className, links }: NavigationProps) {
	return (
		<nav className={cn("mb-16 animate-fade-in", className)}>
			<ul className="flex flex-row text-sm md:text-md lg:text-xl select-none">
				{links.map((item, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: mapped object is static
					<li key={index}>
						<a
							className="duration-500 text-zinc-400 hover:text-zinc-100"
							href={item.href}
							target="_blank"
							rel="noreferrer"
						>
							{item.name}
						</a>
						{index < links.length - 1 && (
							<span className="mx-3 text-white" aria-hidden="true">
								•
							</span>
						)}
					</li>
				))}
			</ul>
		</nav>
	);
}

export { Navigation };
