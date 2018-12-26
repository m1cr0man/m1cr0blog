export interface PageMetadata {
    mainClasses?: string,
    titleSuffix?: string,
    title?: string,
    description?: string,
    date?: string,
    url?: string,
    image?: string,
}

export const TEMPLATE_DATA: PageMetadata = {
    titleSuffix: 'M1cr0man\'s blog',
    title: 'M1cr0man\'s blog',
    mainClasses: '',
}

export const TEMPLATE_DATA_ADMIN: PageMetadata = {
    ...TEMPLATE_DATA,
    mainClasses: 'pure-g padded-body'
}

export const MULTER_TMPDIR = 'storage/multer_temp'
