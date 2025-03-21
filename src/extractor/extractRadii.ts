import extractorInterface from '@typings/extractorInterface'
import { radiusPropertyInterface } from '@typings/propertyObject'
import { customTokenNode } from '@typings/tokenNodeTypes'
import { UnitTypePixel, PropertyType } from '@typings/valueTypes'
import { tokenTypes } from '@config/tokenTypes'
import roundWithDecimals from '@utils/roundWithDecimals'
import { filterByPrefix } from './extractUtilities'
import { tokenCategoryType } from '@typings/tokenCategory'
import { tokenExportKeyType } from '@typings/tokenExportKey'
import config from '@config/config'

const extractRadii: extractorInterface = (tokenNodes: customTokenNode[], prefixArray: string[]): radiusPropertyInterface[] => {
  // get the type of the corner radius
  const getRadiusType = radius => {
    if (typeof radius === 'number') {
      return 'single'
    }
    return 'mixed'
  }
  // get the individual radii
  const getRadii = (node) => ({
    topLeft: {
      value: node.topLeftRadius || 0,
      unit: 'pixel' as UnitTypePixel,
      type: 'number' as PropertyType
    },
    topRight: {
      value: node.topRightRadius || 0,
      unit: 'pixel' as UnitTypePixel,
      type: 'number' as PropertyType
    },
    bottomRight: {
      value: node.bottomRightRadius || 0,
      unit: 'pixel' as UnitTypePixel,
      type: 'number' as PropertyType
    },
    bottomLeft: {
      value: node.bottomLeftRadius || 0,
      unit: 'pixel' as UnitTypePixel,
      type: 'number' as PropertyType
    }
  })
  // return as object
  return tokenNodes.filter(filterByPrefix(prefixArray))
    .map(node => ({
      name: node.name,
      category: 'radius' as tokenCategoryType,
      exportKey: tokenTypes.radius.key as tokenExportKeyType,
      description: node.description || null,
      values: {
        ...(typeof node.cornerRadius === 'number' && {
          radius: {
            value: node.cornerRadius,
            unit: 'pixel' as UnitTypePixel,
            type: 'number' as PropertyType
          }
        }),
        radiusType: {
          value: getRadiusType(node.cornerRadius),
          type: 'string' as PropertyType
        },
        radii: getRadii(node),
        smoothing: {
          value: roundWithDecimals(node.cornerSmoothing, 2),
          comment: 'Percent as decimal from 0.0 - 1.0',
          type: 'number' as PropertyType
        }
      },
      extensions: {
        [config.key.extensionPluginData]: {
          exportKey: tokenTypes.radius.key as tokenExportKeyType
        }
      }
    }))
}

export default extractRadii
