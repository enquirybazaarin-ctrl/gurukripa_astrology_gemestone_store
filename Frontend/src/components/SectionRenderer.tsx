import {
    PackSelection
} from './product-detail/PackSelection';
import {
    FragranceSelector
} from './product-detail/FragranceSelector';
import { ProductSpecs } from './product-detail/ProductSpecs';
import { MoodSection } from './product-detail/MoodSection';
import { UsageScenarios } from './product-detail/UsageScenarios';
import { SafetyCare } from './product-detail/SafetyCare';
import { PackagingDelivery } from './product-detail/PackagingDelivery';
import { ReviewsSection } from './product-detail/ReviewsSection';
import { FAQSection } from './product-detail/FAQSection';
import { RelatedProducts } from './product-detail/RelatedProducts';
import { GlassSpecs } from './product-detail/GlassSpecs';
import { GlassCare } from './product-detail/GlassCare';
import { GlassQuality } from './product-detail/GlassQuality';
import { FactoryAdvantage } from './product-detail/FactoryAdvantage';
import { ThaliSpecs } from './product-detail/ThaliSpecs';
import { WhatsIncluded } from './product-detail/WhatsIncluded';
import { ThaliCare } from './product-detail/ThaliCare';
import { FactoryAdvantageThali } from './product-detail/FactoryAdvantageThali';


// We need to manage some state for pack/fragrance selection at the parent level or context in a real app.
// For now, we'll pass simplified props or basic state if the component requires it.
// Ideally, SectionRenderer should receive necessary callbacks.

interface SectionRendererProps {
    section: any;
    state?: any; // To pass down shared state like selectedPackId
    actions?: any; // To pass down handlers
}

export const SectionRenderer = ({ section, state, actions }: SectionRendererProps) => {
    switch (section.type) {
        case "pack_selection":
            return (
                <PackSelection
                    packs={section.data.packs}
                    selectedPackId={state?.selectedPackId}
                    onSelectPack={actions?.onSelectPack || (() => { })}
                />
            );

        case "fragrance_selector":
            return (
                <FragranceSelector
                    candleCount={state?.candleCount || 1}
                    selectedFragrances={state?.selectedFragrances || []}
                    fragranceOptions={section.data.options}
                    onFragranceChange={actions?.onFragranceChange || (() => { })}
                />
            );

        case "product_specs":
            return <ProductSpecs specs={section.data.specs} />;

        case "mood_section":
            return <MoodSection moods={section.data.moods} bestFor={section.data.bestFor} />;

        case "usage_scenarios":
            return <UsageScenarios scenarios={section.data.scenarios} />;

        case "safety_care":
            return <SafetyCare />;

        case "packaging_delivery":
            return <PackagingDelivery />;

        case "reviews":
            // using static data for props for now as per previous implementation logic
            return <ReviewsSection productId={state?.currentProductId || ''} />;

        case "faq":
            return <FAQSection faqs={section.data.faqs || []} />;

        case "related_products":
            return <RelatedProducts categoryId={state?.categoryId || 'general'} productId={state?.currentProductId || ''} />;

        case "glass_specs":
            return <GlassSpecs specs={section.data.specs} />;

        case "glass_quality":
            return <GlassQuality />;

        case "glass_care":
            return <GlassCare />;

        case "factory_advantage":
            return <FactoryAdvantage />;

        case "thali_specs":
            return <ThaliSpecs specs={section.data.specs} />;

        case "whats_included":
            return <WhatsIncluded />;

        case "thali_care":
            return <ThaliCare />;

        case "factory_advantage_thali":
            return <FactoryAdvantageThali />;

        default:
            console.warn(`Unknown section type: ${section.type}`);
            return null;
    }
};
