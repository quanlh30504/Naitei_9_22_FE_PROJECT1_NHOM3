interface SectionTitleProps {
    title: string;
}

export default function SectionTitle({ title }: SectionTitleProps) {
    return (
        <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 text-center">
                {title}
            </h2>

            <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-px bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-gray-400 dark:text-gray-500 text-xs font-mono">
                    ///////
                </span>
                <div className="w-16 h-px bg-gray-300 dark:bg-gray-600"></div>
            </div>
        </div>
    );
}
