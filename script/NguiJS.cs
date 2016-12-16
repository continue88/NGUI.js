using UnityEngine;
using UnityEditor;
using System.Collections.Generic;
using System.IO;

public class NguiJS
{
    const string JsPrefix = "_data_=";
    static List<UIAtlas> mUsedAtlas = new List<UIAtlas>();
    static List<string> mAtlasImages = new List<string>();


    [MenuItem("NGUI.js/Test")]
    public static void Test()
    {
        Debug.Log(1.23456.ToString("0.##"));
        Debug.Log(123456.ToString("0.##"));
    }

    [MenuItem("NGUI.js/Export")]
    public static void Export()
    {
        if (Selection.gameObjects == null || Selection.gameObjects.Length == 0)
            throw new System.Exception("You must select at least one game object.");

        mUsedAtlas.Clear();
        mAtlasImages.Clear();

        var gos = new List<GameObject>(Selection.gameObjects);
        gos.ForEach(go => File.WriteAllText(EditorUtility.SaveFilePanel("Save As", "", go.name, "js"), JsPrefix + Export(go).ToJson()));
        mUsedAtlas.ForEach(atlas => File.WriteAllText(EditorUtility.SaveFilePanel("Save As", "", atlas.name, "js"), JsPrefix + Export(atlas).ToJson()));
        mAtlasImages.ForEach(path => File.Copy(path, EditorUtility.SaveFilePanel("Save As", "", Path.GetFileName(path), Path.GetExtension(path)), true));
    }

    public static LitJson.JsonData Export(GameObject go)
    {
        var data = new LitJson.JsonData();
        data["name"] = go.name;
        data["transform"] = Export(go.transform);
        data["components"] = Export(go.GetComponents<Component>());

        if (go.transform.childCount > 0)
            data["children"] = ExportChildren(go);
        return data;
    }

    public static LitJson.JsonData ExportChildren(GameObject go)
    {
        var data = new LitJson.JsonData();
        var trans = go.transform;
        for (var i = 0; i < trans.childCount; i++)
            data.Add(Export(trans.GetChild(i).gameObject));
        return data;
    }

    public static LitJson.JsonData Export(Transform trans)
    {
        var data = new LitJson.JsonData();
        data["t"] = Export(trans.localPosition);
        data["r"] = Export(trans.localRotation);
        data["s"] = Export(trans.localScale, Vector3.one);
        return data;
    }

    public static LitJson.JsonData Export(Component[] comps)
    {
        var data = new LitJson.JsonData();
        data.SetJsonType(LitJson.JsonType.Array);
        foreach (var comp in comps)
        {
            var obj = Export(comp);
            if (obj != null)
            {
                obj["meta_type"] = comp.GetType().Name;
                data.Add(obj);
            }
        }
        return data;
    }

    public static LitJson.JsonData Export(Component comp)
    {
        if (comp is UISprite) return Export((UISprite)comp);
        else if (comp is Camera) return Export((Camera)comp);
        else if (comp is UICamera) return Export((UICamera)comp);
        else if (comp is UIPanel) return Export((UIPanel)comp);
        return null;
    }

    public static LitJson.JsonData Export(UISprite sprite)
    {
        if (!mUsedAtlas.Contains(sprite.atlas))
            mUsedAtlas.Add(sprite.atlas);

        var data = new LitJson.JsonData();
        data["atlas"] = sprite.atlas.name;
        data["sprite"] = sprite.spriteName;
        data["c"] = Export(sprite.color);
        Export(data, "t", (int)sprite.type, (int)UIBasicSprite.Type.Simple);
        Export(data, "f", (int)sprite.flip, (int)UIBasicSprite.Flip.Nothing);
        Export(data, "fd", (int)sprite.fillDirection, (int)UIBasicSprite.FillDirection.Radial360);
        Export(data, "fa", sprite.fillAmount, 1.0f);
        Export(data, "fi", sprite.invert, false);
        Export(data, "p", (int)sprite.pivot, (int)UIWidget.Pivot.Center);
        Export(data, "k", (int)sprite.keepAspectRatio, (int)UIWidget.AspectRatioSource.Free);
        Export(data, "a", sprite.aspectRatio, 1.0f);
        Export(data, "w", sprite.width, 100);
        Export(data, "h", sprite.height, 100);
        Export(data, "d", sprite.depth, 0);
        return data;
    }

    public static LitJson.JsonData Export(Camera camera)
    {
        var data = new LitJson.JsonData();
        Export(data, "orth", camera.orthographic, false);
        Export(data, "near", camera.nearClipPlane, 0);
        Export(data, "far", camera.farClipPlane, 0);
        Export(data, "aspect", camera.aspect, 0);
        Export(data, "fov", camera.fieldOfView, 0);
        return data;
    }

    public static LitJson.JsonData Export(UICamera camera)
    {
        var data = new LitJson.JsonData();
        data.SetJsonType(LitJson.JsonType.Object);
        return data;
    }

    public static LitJson.JsonData Export(UIPanel panel)
    {
        var data = new LitJson.JsonData();
        Export(data, "alpha", panel.alpha, 1.0f);
        Export(data, "depth", panel.depth, 0);
        Export(data, "clipping", (int)panel.clipping, (int)UIDrawCall.Clipping.None);
        Export(data, "clipOffset", panel.clipOffset, Vector2.zero);
        Export(data, "clipRange", panel.baseClipRegion, Vector4.zero);
        Export(data, "clipSoftness", panel.clipSoftness, Vector2.zero);
        Export(data, "renderQueue", (int)panel.renderQueue, (int)UIPanel.RenderQueue.Automatic);
        Export(data, "startingRenderQueue", panel.startingRenderQueue, 3000);
        Export(data, "sort", panel.sortingOrder, 0);
        return data;
    }

    public static LitJson.JsonData Export(UIAtlas atlas)
    {
        var data = new LitJson.JsonData();

        // iamge name.
        var tex = atlas.spriteMaterial.mainTexture;
        var path = AssetDatabase.GetAssetPath(tex);
        if (!mAtlasImages.Contains(path)) mAtlasImages.Add(path);
        data["image"] = Path.GetFileName(path);
        data["width"] = tex.width;
        data["height"] = tex.height;

        // pixelSize
        Export(data, "pixelSize", atlas.pixelSize, 1.0f);

        // sprites.
        var sprites = new LitJson.JsonData();
        atlas.spriteList.ForEach(sprite => sprites.Add(Export(sprite)));
        data["sprites"] = sprites;

        return data;
    }

    public static LitJson.JsonData Export(UISpriteData sprite)
    {
        var data = new LitJson.JsonData();
        data["name"] = sprite.name;
        Export(data, "x", sprite.x, 0);
        Export(data, "y", sprite.y, 0);
        Export(data, "w", sprite.width, 0);
        Export(data, "h", sprite.height, 0);
        Export(data, "bl", sprite.borderLeft, 0);
        Export(data, "br", sprite.borderRight, 0);
        Export(data, "bt", sprite.borderTop, 0);
        Export(data, "bb", sprite.borderBottom, 0);
        Export(data, "pl", sprite.paddingLeft, 0);
        Export(data, "pr", sprite.paddingRight, 0);
        Export(data, "pt", sprite.paddingTop, 0);
        Export(data, "pb", sprite.paddingBottom, 0);
        return data;
    }

    public static LitJson.JsonData Export(Color v)
    {
        return Export((Color32)v);
    }

    public static LitJson.JsonData Export(Color32 color32)
    {
        var data = new LitJson.JsonData();
        data.SetJsonType(LitJson.JsonType.Object);
        Export(data, "r", color32.r, 0);
        Export(data, "g", color32.g, 0);
        Export(data, "b", color32.b, 0);
        Export(data, "a", color32.a, 255);
        return data;
    }

    public static LitJson.JsonData Export(Vector2 v) { return Export(v, Vector2.zero); }
    public static LitJson.JsonData Export(Vector2 v, Vector2 def)
    {
        var data = new LitJson.JsonData();
        data.SetJsonType(LitJson.JsonType.Object);
        Export(data, "x", v.x, def.x);
        Export(data, "y", v.y, def.y);
        return data;
    }

    public static LitJson.JsonData Export(Vector3 v) { return Export(v, Vector3.zero); }
    public static LitJson.JsonData Export(Vector3 v, Vector3 def)
    {
        var data = new LitJson.JsonData();
        data.SetJsonType(LitJson.JsonType.Object);
        Export(data, "x", v.x, def.x);
        Export(data, "y", v.y, def.y);
        Export(data, "z", v.z, def.z);
        return data;
    }

    public static LitJson.JsonData Export(Vector4 v) { return Export(v, Vector4.zero); }
    public static LitJson.JsonData Export(Vector4 v, Vector4 def)
    {
        var data = new LitJson.JsonData();
        data.SetJsonType(LitJson.JsonType.Object);
        Export(data, "x", v.x, def.x);
        Export(data, "y", v.y, def.y);
        Export(data, "z", v.z, def.z);
        Export(data, "w", v.w, def.w);
        return data;
    }

    public static LitJson.JsonData Export(Quaternion q)
    {
        var data = new LitJson.JsonData();
        data.SetJsonType(LitJson.JsonType.Object);
        var v = q.eulerAngles;
        Export(data, "x", v.x, 0);
        Export(data, "y", v.y, 0);
        Export(data, "z", v.z, 0);
        return data;
    }
    
    public static void Export(LitJson.JsonData data, string name, int value, int def) { if (value != def) data[name] = value; }
    public static void Export(LitJson.JsonData data, string name, float value, float def) { if (value != def) data[name] = value.ToString("0.##"); }
    public static void Export(LitJson.JsonData data, string name, bool value, bool def) { if (value != def) data[name] = value; }
    public static void Export(LitJson.JsonData data, string name, Vector2 value, Vector2 def) { data[name] = Export(value, def); }
    public static void Export(LitJson.JsonData data, string name, Vector3 value, Vector3 def) { data[name] = Export(value, def); }
    public static void Export(LitJson.JsonData data, string name, Vector4 value, Vector4 def) { data[name] = Export(value, def); }
}
