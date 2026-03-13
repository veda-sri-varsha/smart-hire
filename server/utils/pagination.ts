export type PaginationInfo = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

export function toPaginatedResponse<T>(
	data: T[],
	total: number,
	page: number,
	limit: number,
) {
	return {
		data,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
}
