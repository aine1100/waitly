import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";

export default function Faq() {
	return (
		<div className="flex flex-col items-center justify-center gap-6 py-10">
			<div className="flex flex-col items-center justify-center gap-2 max-w-md">
				<h2 className="sm:text-3xl text-2xl font-semibold text-foreground">
					Frequently Asked Questions
				</h2>
				<p className="sm:text-base text-sm text-muted-foreground text-center">
					Everything you need to know about Neurolab devices and preorders.
				</p>
			</div>
			<div className="w-full max-w-lg">
				<Accordion
					type="single"
					collapsible
					className="w-full flex flex-col gap-4"
				>
					<AccordionItem value="item-1">
						<AccordionTrigger className="hover:no-underline">
							What is the Neurolab device?
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground">
							The Neurolab device is a next-generation brain-computer interface
							that enables direct neural interaction with AI systems. It combines
							advanced neurotechnology with machine learning to create seamless
							human-AI collaboration experiences.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger className="hover:no-underline">
							When will my device ship?
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground">
							Neurolab devices are expected to ship in early 2026. Preorder
							customers will receive priority shipping and will be notified
							with tracking information as soon as devices are ready for
							shipment.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-3">
						<AccordionTrigger className="hover:no-underline">
							Is the device safe to use?
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground">
							Yes, safety is our top priority. The Neurolab device uses
							non-invasive neural sensing technology and has undergone
							extensive testing. It meets all FDA safety standards and
							international medical device regulations.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	);
}
