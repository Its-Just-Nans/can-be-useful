import { writable } from "svelte/store";

export const product = writable({
    name: {
        type: "text",
        question: "What is the name of this product?",
        name: "name",
        value: "",
        placeholder: "Enter product name",
    },
    isVirtual: {
        type: "radio",
        question: "Is this a virtual product? (app, website, etc.)",
        name: "virtual-product",
        value: "",
    },
    physical: {
        safeChildren: {
            type: "radio",
            question: "Does this product contain small parts?",
            name: "safe-children",
            value: "",
        },
        healthRelated: {
            type: "radio",
            question: "Is this product health-related?",
            name: "health-related",
            value: "",
        },
        biodegradable: {
            type: "radio",
            question: "Is this product biodegradable?",
            name: "biodegradable",
            value: "",
        },
        electronics: {
            type: "radio",
            question: "Is this product an electronic device?",
            name: "electronics",
            value: "",
        },
    },
    sustainable: {
        type: "radio",
        question: "Is this product sustainable?",
        name: "sustainable",
        value: "",
    },
    recyclable: {
        type: "radio",
        question: "Is this product recyclable?",
        name: "recyclable",
        value: "",
    },
    behaviourChange: {
        type: "radio",
        question: "Does this product aim to change behaviour?",
        name: "behaviour-change",
        value: "",
    },
    emotional: {
        type: "radio",
        question: "Does this product aim to evoke an emotional response?",
        name: "emotional",
        value: "",
    },
    majority: {
        type: "radio",
        question: "Is this product aimed at the majority?",
        name: "majority",
        value: "",
    },
    cultureSensitive: {
        type: "radio",
        question: "Is this product sensitive to culture?",
        name: "culture-sensitive",
        value: "",
    },
    nonHuman: {
        type: "radio",
        question: "Is this product non-human?",
        name: "non-human",
        value: "",
    },
    subscription: {
        type: "radio",
        question: "Is this product a subscription?",
        name: "subscription",
        value: "",
    },
    price: {
        type: "text",
        question: "What is the cost of this product?",
        name: "price",
        value: "",
    },
    designThinking: {
        designThinking: {
            type: "radio",
            question: "Design for health?",
            name: "Design for health",
            value: "",
        },
        planProduct: {
            type: "radio",
            question: "Plan the product?",
            name: "Plan the product",
            value: "",
        },
        massProduction: {
            type: "radio",
            question: "make plan for mass production",
            name: "make plan for mass production",
            value: "",
        },
    },
    aroundProduct: {
        service: {
            type: "radio",
            question: "Service around the product ?",
            name: "service",
            value: "",
        },
        it: {
            type: "radio",
            question: "Does your product need IT support?",
            name: "it",
            value: "",
        },
        optional: {
            type: "radio",
            question: "Does your product has optional components?",
            name: "optional",
            value: "",
        },
        wrapper: {
            type: "radio",
            question: "Can we make a wrapper of your product?",
            name: "wrapper",
            value: "",
        },
        otherUsage: {
            type: "radio",
            question: "Can we use your product for other usage?",
            name: "other-usage",
            subtext: "umbrella -> umbrella for sun",
            value: "",
        },
    },
    realLife: {
        feedback: {
            type: "radio",
            question: "Did you ask feedback from people?",
            name: "feedback",
            value: "",
        },
        interviews: {
            type: "radio",
            question: "Have you tried interviewing people about your product helping them?",
            name: "interviews",
            value: "",
        },
        questionnaries: {
            type: "radio",
            question: "Have you tried questionnaries?",
            name: "questionnaries",
            value: "",
        },
        focusGroup: {
            type: "radio",
            question: "Have you tried focus group?",
            name: "focus-group",
            value: "",
        },
        rolePlay: {
            type: "radio",
            question: "Have you tried role play?",
            name: "role-play",
            value: "",
        },
        personas: {
            type: "radio",
            question: "Have you tried personas?",
            name: "personas",
            value: "",
        },
        interaction: {
            type: "radio",
            question: "Have you tried interaction?",
            name: "interaction",
            subtext: "for alone usage and for a group",
            value: "",
        },
        storyboarding: {
            type: "radio",
            question: "Have you tried storyboarding?",
            name: "storyboarding",
            value: "",
        },
    },
    wwwwwh: {
        name: "WWWWWH ?",
        subtext: "Ask yourself about a problem using these questions : What, Where, When, Who, Why, How ?",
        where: {
            type: "text",
            question: "Where ?",
            name: "where",
            value: "",
        },
        when: {
            type: "text",
            question: "When ?",
            name: "when",
            value: "",
        },
        who: {
            type: "text",
            question: "Who ?",
            name: "who",
            value: "",
        },
        what: {
            type: "text",
            question: "What ?",
            name: "what",
            value: "",
        },
        why: {
            type: "text",
            question: "Why ?",
            name: "why",
            value: "",
        },
        how: {
            type: "text",
            question: "How ?",
            name: "how",
            value: "",
        },
    },
    findingProduct: {
        problemDefinition: {
            type: "radio",
            question: "Problem definition?",
            subtext: "What is the problem you are trying to solve?",
            name: "problem-definition",
            value: "",
        },
        analysis: {
            type: "radio",
            question: "Function Analysis?",
            subtext: "What is the function of your product?",
            name: "function-analysis",
            value: "",
        },
        value: {
            type: "radio",
            question: "what value?",
            subtext: "What value are you adding with your product?",
            name: "value-proposition",
            value: "",
        },
        analogy: {
            type: "radio",
            question: "Analogy with natural things (biommicry, synthethics)?",
            subtext: "Does your product uses analogy with natural things?",
            name: "analogy",
            value: "",
        },
        morphological: {
            type: "radio",
            question: "Morphological chart?",
            subtext: "Does a morphological chart can help you?",
            name: "morphological",
            value: "",
        },
    },
    design: {
        materialDriven: {
            type: "radio",
            question: "Is the material driven design?",
            name: "material-driven",
            value: "",
        },
        dataDriven: {
            type: "radio",
            question: "Is the data driven design?",
            name: "data-driven",
            subtext: "Does your product solve a problem that is measured by data",
            value: "",
        },
        braindrawing: {
            type: "radio",
            question: "Is the braindrawing design?",
            name: "braindrawing",
            value: "",
        },
        design: {
            type: "radio",
            question: "design drawing?",
            name: "design",
            value: "",
        },
    },
    business: {
        trendForesight: {
            type: "radio",
            question: "Trend foresight?",
            name: "trend-foresight",
            value: "",
        },
        productJourney: {
            type: "radio",
            question: "Product journey?",
            name: "product-journey",
            value: "",
        },
        sustainable: {
            type: "radio",
            question: "Sustainable?",
            name: "sustainable",
            value: "",
        },
        growthMatrix: {
            type: "radio",
            question: "ansoff growth matrix?",
            name: "growth-matrix",
            value: "",
        },
        vrio: {
            type: "radio",
            question: "VRIO analysis?",
            name: "vrio",
            value: "",
        },
        analytics: {
            type: "radio",
            question: "Analytics?",
            name: "analytics",
            value: "",
        },
        users: {
            type: "radio",
            question: "How to have more Users?",
            name: "users",
            value: "",
        },
        brand: {
            type: "radio",
            question: "How to have a strong brand?",
            name: "brand",
            value: "",
        },
        brand_dna: {
            type: "radio",
            question: "Brand DNA?",
            name: "brand-dna",
            value: "",
        },
        roadmap: {
            type: "radio",
            question: "Roadmap for the product what it's future, the ameliorations ?",
            name: "roadmap",
            value: "",
        },
    },
    isFound: {
        type: "radio",
        question: "Did you have a product idea?",
        name: "is-found",
        value: "",
    },
    product: {
        lifeCycle: {
            type: "radio",
            question: "Roadmap for the product life, from creation to destruction (recycling) Lifecycle ?",
            name: "life-cycle",
            value: "",
        },
        swot: {
            type: "radio",
            question: "SWOT analysis?",
            name: "swot",
            value: "",
        },
        comfort: {
            type: "radio",
            question: "Comfort of the product?",
            name: "comfort",
            value: "",
        },
        accessibility: {
            type: "radio",
            question: "Accessibility of the product?",
            name: "accessibility",
            value: "",
        },
        stepByStep: {
            type: "radio",
            question: "step by step how to buy, use, sell your product?",
            name: "step-by-step",
            value: "",
        },
        documentation: {
            type: "radio",
            question: "Documentation of the product?",
            name: "documentation",
            value: "",
        },
        technical: {
            type: "radio",
            question: "Technical documentation?",
            name: "technical",
            value: "",
        },
        cultural: {
            type: "radio",
            question: "Does your product respect and adapat with different cultur?",
            name: "cultural",
            value: "",
        },
        harris_profile: {
            type: "radio",
            question: "Harris profile?",
            name: "harris-profile",
            value: "",
        },
        prototype: {
            type: "radio",
            question: "Prototype? Is is usable",
            name: "prototype",
            value: "",
        },
        video_prototype: {
            type: "radio",
            question: "Video prototype 3D modelisation?",
            name: "video-prototype",
            value: "",
        },
        wireframe: {
            type: "radio",
            question: "Wireframe?",
            name: "wireframe",
            value: "",
        },
    },
});

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}
