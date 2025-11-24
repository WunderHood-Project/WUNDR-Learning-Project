export default function Stepper({ current, total = 3 }: { current: number; total?: number }) {
	return (
		<div className="flex justify-center pt-2 md:pt-4">
			<div className="flex space-x-1 md:space-x-2">
				{Array.from({ length: total }, (_, i) => i + 1).map(step => (
					<div
						key={step}
						className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-colors ${step <= current ? "bg-green-500" : "bg-gray-300"}`}
					/>
				))}
			</div>
		</div>
	)
}
