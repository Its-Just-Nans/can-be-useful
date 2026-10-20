
import Pages from "../sections/index"

const defaultMenus = [

    {
        icon: "../public/img/icons.svg",
        links: [
            {
                title: "trans:identity-papers-citizenship",
                links: [
                    {
                        title: "trans:general",
                        component: Pages.Custom,
                    },
                    {
                        title: "trans:contact",
                        component: Pages.Custom,
                    }
                ]
            },
            {
                title: "trans:family-dependent",
                links: [
                    {
                        title: "trans:booklet",
                        component: Pages.Custom,
                    },
                    {
                        title: "trans:partner",
                        component: Pages.Custom,
                    },
                    {
                        title: "trans:kids_Id",
                        component: Pages.Custom,
                    },
                    {
                        title: "trans:dependent_Id",
                        component: Pages.Custom,
                    },

                ],
            },
            {
                icon: "../public/img/icons.svg",
                title: "trans:transports",
                links: [
                    {
                        title: "trans:drivers_license",
                        component: Pages.Custom,
                    },
                    {
                        title: "trans:vehicle",
                        component: Pages.Custom,
                    },
                    {
                        title: "trans:public_transports",
                        component: Pages.Custom,
                    },

                ],
            },
            {
                icon: "../public/img/icons.svg",
                title: "trans:work-unemployment-income",
                links: [
                    {
                        title: "trans:schooling",
                        component: Pages.Custom,
                    },
                    {
                        title: "trans:degrees",
                        component: Pages.Custom,
                    },
                    {
                        title: "trans:scholarship",
                        component: Pages.Custom,
                    },
                    {
                        title: "trans:professional_activity",
                        component: Pages.Custom,
                    },
                ],
            },
            {
                icon: "../public/img/icons.svg",
                title: "trans:housing",
                links: [
                    {
                        title: "trans:principal_residence",
                        component: Pages.Custom,
                    },
                    {
                        title: "trans:secondary_residence",
                        component: Pages.Custom,
                    },
                ],
            },
            {
                icon: "../public/img/icons.svg",
                title: "trans:taxes_money",
                component: Pages.Custom,
            },
            {
                icon: "../public/img/icons.svg",
                title: "trans:healthcare",
                component: Pages.Custom,
            },
            {
                icon: "../public/img/icons.svg",
                title: "trans:leisure",
                component: Pages.Custom,
            },
            {
                icon: "../public/img/icons.svg",
                title: "trans:foreigner",
                component: Pages.Custom,
            },
            {
                icon: "../public/img/icons.svg",
                title: "trans:identification",
                component: Pages.Custom,
            },
        ],
    },
];

export {
    defaultMenus
}