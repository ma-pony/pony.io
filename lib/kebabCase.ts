import { slug } from 'github-slugger'

// pliny <0.2 exported this from 'pliny/utils/kebabCase'; it was simply slug().
// Kept local so tag slugs stay identical to the previously generated tag-data.
export const kebabCase = (str: string) => slug(str)
