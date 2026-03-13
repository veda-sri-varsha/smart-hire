export const JOB_INCLUDE = {
	company: {
		select: {
			id: true,
			name: true,
			companyName: true,
			profilePicture: true,
			email: true,
			companyWebsite: true,
		},
	},
	_count: {
		select: {
			applications: true as const,
		},
	},
};

export const JOB_MINIMAL_INCLUDE = {
	company: {
		select: {
			id: true,
			name: true,
			companyName: true,
			profilePicture: true,
		},
	},
	_count: {
		select: {
			applications: true as const,
		},
	},
};

export const APPLICATION_INCLUDE = {
	user: {
		select: {
			id: true,
			name: true,
			email: true,
			phone: true,
			profilePicture: true,
			resumeUrl: true,
		},
	},
	job: {
		select: {
			id: true,
			title: true,
			location: true,
			jobType: true,
			companyId: true,
			company: {
				select: {
					id: true,
					name: true,
					companyName: true,
					profilePicture: true,
					email: true,
				},
			},
		},
	},
};
