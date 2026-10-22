// schemaTypes/post.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Shown as the post heading and in Google results. 70 characters max.',
      validation: (Rule) => [
        Rule.required().error('Add a title before publishing.'),
        Rule.max(70).error('Keep the title to 70 characters or fewer, or Google will cut it off.'),
      ],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description:
        'One or two sentences. Shown on blog cards, under the post title and in Google results. 160 characters max.',
      validation: (Rule) => [
        Rule.required().error('Add a summary before publishing.'),
        Rule.max(160).error('Keep the summary to 160 characters or fewer.'),
        Rule.min(50).warning('A very short summary can look thin on the blog cards.'),
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readingTime',
      title: 'Time to Read (minutes)',
      type: 'number',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {type: 'block'},
        {type: 'image', options: {hotspot: true}},
      ],
      // The website can't render a post with no body, so this blocks publishing one.
      validation: (Rule) => Rule.required().min(1).error('Add some body text before publishing.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'summary',
      media: 'mainImage',
    },
  },
})