import { Avatar, Menu } from '@/ui'
import { Code, DotsThreeOutlineVertical, Flag, Star } from 'phosphor-react'
import Link from 'next/link'
import { User } from 'src/pages/members'
import { HomePageFeedUpdateType } from 'src/pages'
import { DateTime } from 'luxon'
import Markdown from './Markdown'

function HomePageFeedUpdate({ update }: { update: HomePageFeedUpdateType }) {
  const { postedBy, createdAt: createdAtInMillis, goal, description } = update
  const createdAt = DateTime.fromMillis(createdAtInMillis)
  return (
    <li className="bg-white px-4 py-6 shadow sm:p-6 sm:rounded-lg">
      <article aria-labelledby="question-title-81614">
        <div>
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <Avatar src={postedBy.image} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                <a href="/" className="hover:underline">
                  {postedBy.name}
                </a>
              </p>
              <p className="text-sm text-gray-500">
                <time dateTime={createdAt.toISO()}>
                  {createdAt.toLocaleString(DateTime.DATETIME_MED)}
                </time>
              </p>
            </div>
            <Menu
              trigger={<DotsThreeOutlineVertical className="cursor-pointer" />}
              className="z-10 ml-3"
            >
              <Link href={'/'} passHref={true}>
                <Menu.Item icon={Star}>Add to favourites</Menu.Item>
              </Link>
              <Link href={'/'} passHref={true}>
                <Menu.Item icon={Code}>Embed</Menu.Item>
              </Link>
              <Link href={'/'} passHref={true}>
                <Menu.Item icon={Flag}>Report Content</Menu.Item>
              </Link>
            </Menu>
          </div>
          <h2
            id="question-title-81614"
            className="mt-4 text-base font-medium text-gray-900"
          >
            {goal.title}
          </h2>
        </div>
        <div className="mt-2 text-sm text-gray-700 space-y-4">
          <div className="prose prose-sm max-w-none">
            <Markdown>{description}</Markdown>
          </div>
        </div>
        <div className="mt-6 flex justify-between space-x-8">
          <div className="flex space-x-6">
            <span className="inline-flex items-center text-sm">
              <button className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                <svg
                  className="h-5 w-5"
                  data-todo-x-description="Heroicon name: solid/thumb-up"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                </svg>
                <span className="font-medium text-gray-900">29</span>
                <span className="sr-only">likes</span>
              </button>
            </span>
            <span className="inline-flex items-center text-sm">
              <button className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                <svg
                  className="h-5 w-5"
                  data-todo-x-description="Heroicon name: solid/chat-alt"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="font-medium text-gray-900">11</span>
                <span className="sr-only">replies</span>
              </button>
            </span>
            <span className="inline-flex items-center text-sm">
              <button className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                <svg
                  className="h-5 w-5"
                  data-todo-x-description="Heroicon name: solid/eye"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="font-medium text-gray-900">2.7k</span>
                <span className="sr-only">views</span>
              </button>
            </span>
          </div>
          <div className="flex text-sm">
            <span className="inline-flex items-center text-sm">
              <button className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                <svg
                  className="h-5 w-5"
                  data-todo-x-description="Heroicon name: solid/share"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
                </svg>
                <span className="font-medium text-gray-900">Share</span>
              </button>
            </span>
          </div>
        </div>
      </article>
    </li>
  )
}

export default function HomePageFeed({
  user = {},
  updates,
}: {
  user?: User
  updates: HomePageFeedUpdateType[]
}) {
  return (
    <>
      <div className="px-4 sm:px-0">
        <div className="sm:hidden">
          <label htmlFor="question-tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="question-tabs"
            className="block w-full rounded-md border-gray-300 text-base font-medium text-gray-900 shadow-sm focus:border-brand-500 focus:ring-brand-500"
          >
            <option value="#/recent">Recent</option>
            <option value="#/most-liked">Most Liked</option>
            <option value="#/most-answers">Most Answers</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <nav
            className="relative z-0 rounded-lg shadow flex divide-x divide-gray-200"
            aria-label="Tabs"
          >
            <a
              href="/"
              aria-current="page"
              className="text-gray-900 rounded-l-lg  group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
            >
              <span>Recent</span>
              <span
                aria-hidden="true"
                className="bg-brand-500 absolute inset-x-0 bottom-0 h-0.5"
              ></span>
            </a>

            <a
              href="/"
              aria-current="false"
              className="text-gray-500 hover:text-gray-700   group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
            >
              <span>Most Liked</span>
              <span
                aria-hidden="true"
                className="bg-transparent absolute inset-x-0 bottom-0 h-0.5"
              ></span>
            </a>

            <a
              href="/"
              aria-current="false"
              className="text-gray-500 hover:text-gray-700  rounded-r-lg group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
            >
              <span>Most Answers</span>
              <span
                aria-hidden="true"
                className="bg-transparent absolute inset-x-0 bottom-0 h-0.5"
              ></span>
            </a>
          </nav>
        </div>
      </div>
      <div className="mt-4">
        <h1 className="sr-only">Recent questions</h1>
        <ul className="space-y-4">
          {updates.map((update) => (
            <HomePageFeedUpdate update={update} key={update.id} />
          ))}
        </ul>
      </div>
    </>
  )
}
