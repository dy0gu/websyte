import Particles from "~/components/particles";

const links = [
    { name: "Email", href: "mailto:email@diogo.work" },
    { name: "GitHub", href: "https://www.github.com/dy0gu" },
    { name: "Stack", href: "https://stackoverflow.com/users/22441488" },
];

export default function Page() {
    return (
        <section className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
            <nav className="my-16 mx-16 animate-fade-in">
                <ul className="flex list-none flex-row text-sm md:text-md lg:text-xl items-center justify-center gap-4 marker:text-green list-outside list-disc">
                    {links.map((item) => (
                        <li key={item.href}>
                            <a
                                href={item.href}
                                className="duration-500 text-zinc-500 hover:text-zinc-300"
                            >
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="hidden mx-16 w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
            <Particles className="absolute inset-0 -z-10 animate-fade-in" />
            <h1 className="z-10 text-6xl md:text-7xl lg:text-8xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display bg-clip-text ">
                <b>DY0GU</b>
            </h1>

            <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
            <div className="my-16 mx-16 text-center animate-fade-in">
                <h2 className="text-sm md:text-md lg:text-xl text-zinc-500 text-balance">
                    {/* <Typewriter
						options={{
							strings: [
								"",
								"",
								"Writing <span style='color: white;'>code</span> since...?",
								"Is making your own website a <span style='color: white;'>developer</span> cliché already?",
								"Watch my all time favorite <a href=https://www.youtube.com/watch?v=xvFZjo5PgG0 style='text-decoration: underline; color: white;'>video</a> on YouTube!",
								"The <span style='color: white;'>cake</span> was, in fact, a lie.",
								"You should also check out <a href=https://www.instagram.com/jtsimoes style='text-decoration: underline; color: white;'>jtsimoes</a>!",
								"Do you think this <span style='color: white;'>font</span> is too big?",
								"Ireland is just one <span style='color: white;'>sea</span> away from Iceland.",
								"We've got some <span style='color: hotpink;'>pink</span> text too, if you want it!",
								"They had a broken <span style='color: white;'>keyboard</span>, I bought a broken keyboard.",
								"Do you want ants? Because that's how you get <span style='color: white;'>ants</span>!",
								"Snake? <span style='color: white;'>Snake?</span> SNAAAAAAKE!",
								"01100100 <span style='color: white;'>01111001</span> 00110000 <span style='color: white;'>01100111</span> 01110101",
								"How about another <span style='color: white;'>joke</span>, Murray?",
								"Hotdogs all look the same because they're <span style='color: white;'>in-bread</span>.",
								"That's what <span style='color: white;'>she</span> said!",
								"Apathy's a tragedy and <span style='color: white;'>boredom</span> is a crime.",
								"Did I ever tell you the <span style='color: white;'>definition</span> of insanity?",
								"I like <span style='color: white;'>shorts</span>! They're comfy and easy to wear!",
								"All we had to do was follow the <span style='color: white;'>damn</span> train, CJ!",
								"Crazy? I was <span style='color: white;'>crazy</span> once.",
								"",
								"You're really <span style='color: white;'>still</span> reading these?",
								"Come on, get out, there is <span style='color: white;'>nothing</span> else to see here.",
								"I'm <span style='color: white;'>serious</span>, no more references.",
								"",
								"Okay now you're making me <span style='color: white;'>upset</span>.",
								"",
								"<span style='color: white;'>Go</span> away.",
								"",
								"You know what? I'm just gonna <span style='color: white;'>loop</span> this text, see if you like that.",
							],
							autoStart: true,
							loop: true,
							deleteSpeed: 25,
							delay: 75,
						}}
					/> */}
                </h2>
            </div>
        </section>
    );
}
