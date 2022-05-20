export const formatProjectName = (name: string): string => name
	.replace(/ +/g, '_')
	.replace(/[^\da-zA-Z_-]+/g, '');