import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "~/utils/cn";

const beamVariants = cva(
	`w-screen h-px animate-glow bg-gradient-to-r from-zinc-300/0
     via-zinc-300/50 to-zinc-300/0`,
	{
		variants: {
			disappear: {
				"fade-left": "animate-fade-left",
				"fade-right": "animate-fade-right",
			},
		},
	},
);

type BeamProps = VariantProps<typeof beamVariants> & {
	className?: string;
};

function Beam({ disappear: animation, className }: BeamProps) {
	return (
		<div className={cn(beamVariants({ disappear: animation, className }))} />
	);
}

export { Beam };
