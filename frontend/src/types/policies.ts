export type WaiverSection = {
    key: string;
    title: string;
    body: string;
};

export type WaiverSnapshot = {
    docType: "liability_waiver";
    version: string;
    language: "en" | string;
    fullText: string;
    sections: WaiverSection[];
    conductPolicyShort: string;
};
