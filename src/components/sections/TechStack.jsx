import TitleHeader from "../TitleHeader";

const row1Techs = [
    { name: "Python", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "JavaScript", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "React", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Node.js", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "FastAPI", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
    // { name: "PyTorch", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
    { name: "PostgreSQL", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { name: "Tensorflow", imgPath: "/images/logos/Tensorflowlogo.png" },
    { name: "MongoDB", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "C++", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
    { name: "C", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
];

const row2Techs = [
    { name: "Docker", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "GitHub", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
    { name: "Figma", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
    { name: "Supabase", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
    { name: "VS Code", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
    { name: "Blender", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg" },
    { name: "SQL", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    { name: "Streamlit", imgPath: "/images/logos/streamlitlogo.png" },
    { name: "Jira", imgPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" },
];

const TechCard = ({ name, imgPath }) => (
    <div
        style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#141414",
            border: "1px solid #242424",
            borderRadius: "10px",
            padding: "12px 20px",
            minWidth: "160px",
            flexShrink: 0,
            transition: "border-color 0.2s, background 0.2s",
            cursor: "default",
        }}
        onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#444";
            e.currentTarget.style.background = "#1c1c1c";
        }}
        onMouseLeave={e => {
            e.currentTarget.style.borderColor = "#242424";
            e.currentTarget.style.background = "#141414";
        }}
    >
        <img src={imgPath} alt={name} style={{ width: 36, height: 36, objectFit: "contain", flexShrink: 0 }} />
        <span style={{ color: "#e0e0e0", fontSize: "14px", fontWeight: 500, whiteSpace: "nowrap" }}>{name}</span>
    </div>
);

const SliderRow = ({ techs, direction }) => {
    const animationName = direction === "left" ? "scrollLeft" : "scrollRight";
    const duration = direction === "left" ? "28s" : "32s";

    return (
        <div style={{ overflow: "hidden", width: "100%" }}>
            <div
                style={{
                    display: "flex",
                    gap: "14px",
                    width: "max-content",
                    marginBottom: "14px",
                    animation: `${animationName} ${duration} linear infinite`,
                }}
                onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
                onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
            >
                {[...techs, ...techs].map((tech, i) => (
                    <TechCard key={i} {...tech} />
                ))}
            </div>
        </div>
    );
};

const TechStack = () => {
    return (
        <>
            {/* Inject keyframes into the page once */}
            <style>{`
        @keyframes scrollLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

            <div id="skills" className="flex-center section-padding">
                <div className="w-full h-full md:px-10 px-5">
                    <div style={{ marginBottom: "56px" }}>
                        <TitleHeader
                            title="How I Can Contribute & My Key Skills"
                            sub="🤝 What I Bring to the Table"
                        />
                    </div>

                    <div
                        style={{
                            maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                            WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                            overflow: "hidden",
                            marginTop: "64px"
                        }}
                    >
                        <SliderRow techs={row1Techs} direction="left" />
                        <SliderRow techs={row2Techs} direction="right" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default TechStack;